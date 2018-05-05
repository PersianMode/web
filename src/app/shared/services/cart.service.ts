import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {ReplaySubject} from 'rxjs/ReplaySubject';

const SNACK_CONFIG: MatSnackBarConfig = {
  duration: 3200,
  direction: 'rtl',
};

@Injectable()
export class CartService {
  cartItems: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private localStorageKey = 'cart';
  coupon_discount = 0;
  itemAdded$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private httpService: HttpService, private authService: AuthService, private snackBar: MatSnackBar) {
    this.authService.isLoggedIn.subscribe(
      isLoggedIn => {
        // Read data from localStorage and save in server if any data is exist in localStorage
        const items = this.getItemsFromStorage();

        if (this.authService.userIsLoggedIn() && items && items.length) {
          items.forEach((el, i) => {
            this.httpService.post('order', {
              product_id: el.product_id,
              product_instance_id: el.instance_id,
              number: el.quantity,
            })
              .subscribe(() => {
                  items.splice(i, 1);
                  try {
                    localStorage.setItem(this.localStorageKey, JSON.stringify(items));
                  } catch (e) {
                    console.error('could not update local storage after login', e);
                  }
                },
                err => console.error('orders error: ', el, err)
              );
          });
        } else if (!items && items.length) {
          this.setCartItem([], false);
        }

        this.getItemsDetail(items && items.length ? items : null)
          .then(res => {
            this.setCartItem(res, false);
          })
          .catch(err => {
            console.error('Cannot fetch cart items: ', err);
            this.setCartItem([]);
          });
      });
  }

  emptyCart() {
    this.cartItems.next([]);
    if (!this.authService.userIsLoggedIn()) {
      try {
        localStorage.setItem(this.localStorageKey, JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
    }
  }

  removeItem(value) {
    if (this.authService.userIsLoggedIn()) {
      // Update server
      this.httpService.post('order/delete', {
        product_instance_id: value.instance_id,
      }).subscribe(
        () => {
          this.cartItems.next(this.cartItems.getValue().filter(el => el.instance_id !== value.instance_id));
        },
        (err) => {
          console.error('Cannot delete item from cart: ', err);
        });
    } else {
      // Update local storage
      let tempItems = this.getItemsFromStorage();
      tempItems = tempItems.filter(el => el.product_id !== value.product_id
        && el.instance_id !== value.instance_id);

      try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(tempItems));
        this.cartItems.next(this.cartItems.getValue().filter(el => el.instance_id !== value.instance_id));
      } catch (e) {
        this.snackBar.open('ذخیره سبد در حالت Private و بدون login ممکن نیست.', null, SNACK_CONFIG);
      }
    }
  }

  updateItem(value) {
    let items = this.cartItems.getValue();
    const instanceChange = value.instance_id !== value.pre_instance_id;
    const update = () => {
      const curInstance = items.find(el => el.product_id === value.product_id && el.instance_id === value.instance_id);
      const newInstance = items.find(el => el.product_id === value.product_id && el.instance_id === value.pre_instance_id);
      const product = curInstance || newInstance;
      const instance = product.instances.find(r => (r.instance_id || r._id) === value.instance_id);
      Object.assign(product, {
        product_id: value.product_id,
        instance_id: value.instance_id,
        quantity: instanceChange && curInstance ? value.number + curInstance.quantity : value.number,
        price: instance.price ? instance.price : product.price,
        size: instance.size,
        count: instance.quantity,
      });
      if (instanceChange && curInstance)
        items = items.filter(el => el.product_id !== value.product_id || el.instance_id !== value.pre_instance_id);
      this.cartItems.next(items);
    };
    // Should delete and add new product's instance
    if (this.authService.userIsLoggedIn()) {
      // Change in server
      this.httpService.post('order/delete', {
        product_instance_id: value.pre_instance_id,
      }).subscribe(
        () => {
          this.httpService.post('order', {
            product_id: value.product_id,
            product_instance_id: value.instance_id,
            number: value.number
          }).subscribe((dt) => {
              update();
            }, (err) => {
              console.error('Cannot add new order-line to order in server: ', err);
            }
          );
        },
        (err) => {
          console.error('Cannot delete the specific product instance in server: ', err);
        }
      );
    } else {
      // Change in localStorage
      let ls_items = this.getItemsFromStorage();
      const cur_ls_item = ls_items.find(el => el.product_id === value.product_id && el.instance_id === value.instance_id);
      const new_ls_item = ls_items.find(el => el.product_id === value.product_id && el.instance_id === value.pre_instance_id);
      const ls_item = cur_ls_item || new_ls_item;
      Object.assign(ls_item, {
        product_id: value.product_id,
        instance_id: value.instance_id,
        quantity: instanceChange && cur_ls_item ? cur_ls_item.quantity + value.number : value.number,
      });
      if (instanceChange && cur_ls_item)
        ls_items = ls_items.filter(el => el.product_id !== value.product_id || el.instance_id !== value.pre_instance_id)
      try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(ls_items));
        update();
      } catch (e) {
        this.snackBar.open('ذخیره سبد در حالت Private و بدون login ممکن نیست.', null, SNACK_CONFIG);
        console.log(e);
      }
    }
  }

  saveItem(item) {
    this.itemAdded$.next(false);
    if (this.authService.userIsLoggedIn()) {
      // Update order in server
      this.saveItemToServer(item);
    } else {
      // Save data on storage
      this.saveItemToStorage(item);
    }
  }

  getItemsDetail(items) {
    return new Promise((resolve, reject) => {
      this.httpService.post('cart/items', {data: items}).subscribe(
        (rs: any) => {
          resolve(rs);
        },
        (err) => {
          reject(err);
        });
    });
  }

  private setCartItem(items, isUpdate = true) {
    const itemList = [];

    items.forEach((el: any) => {
      const objItem: any = {};
      objItem.order_id = el.order_id;
      objItem.product_id = el.product_id;
      objItem.instance_id = el.instance_id;
      objItem.productType = el.type;
      objItem.name = el.name;
      objItem.color = el.color;
      objItem.size = el.size;
      objItem.quantity = el.quantity;
      objItem.tags = el.tags;
      objItem.count = el.count;
      objItem.thumbnail = el.thumbnail;
      objItem.instances = el.instances;
      objItem.price = el.instance_price ? el.instance_price : el.base_price;
      objItem.discount = el.discount;
      // objItem.discount = (el.discount && el.discount.length > 0) ?
      //   (objItem.price - (el.discount.reduce((a, b) => a * b) * objItem.price)) : 0;

      itemList.push(objItem);
    });

    if (isUpdate)
      this.cartItems.next(this.cartItems.getValue().concat(itemList));
    else
      this.cartItems.next(itemList);
  }

  private getItemsFromStorage() {
    return JSON.parse(localStorage.getItem(this.localStorageKey)) === null ? [] : JSON.parse(localStorage.getItem(this.localStorageKey));
  }

  private saveItemToServer(item) {
    this.httpService.post('order', {
      product_id: item.product_id,
      product_instance_id: item.product_instance_id,
    }).subscribe(
      res => {
        this.addToCart(item, res._id);
      },
      err => {
        this.itemAdded$.next(err);
        this.snackBar.open('ذخیره کالای مورد نظر ممکن نیست، لطفاً صفحه را refresh کنید و یا بعداً دوباره سعی کنید.', null, SNACK_CONFIG);
        console.error(err);
      });
  }

  private saveItemToStorage(item) {
    const data = this.getItemsFromStorage();
    const found = data.find(r => r.product_id === item.product_id && r.instance_id === item.product_instance_id);
    if (found)
      found.quantity++;
    else
      data.push({
        quantity: 1,
        instance_id: item.product_instance_id,
        product_id: item.product_id,
      });
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      this.addToCart(item);
    } catch (e) {
      this.snackBar.open('ذخیره سبد در حالت Private و بدون login ممکن نیست.', null, SNACK_CONFIG);
      console.error('Cannot save item to local storage: ', e);
      this.itemAdded$.next(e);
    }
  }

  private addToCart(item, order_id = null) {
    this.itemAdded$.next(true);
    const currentValue = this.cartItems.getValue();
    const object = {
      product_id: item.product_id,
      instance_id: item.product_instance_id,
      quantity: 1,
      order_id,
    };
    const found = currentValue.find(r => r.product_id === object.product_id && r.instance_id === object.instance_id);
    if (found)
      found.quantity += 1;
    else {
      const instance = item.instances.find(r => r._id === object.instance_id);
      const color = item.colors.find(r => r._id === instance.product_color_id);
      currentValue.push(Object.assign(object, {
        size: instance.size,
        color,
        count: instance.inventory.map(r => r.count).reduce((x, y) => +x + +y, 0),

        instances: item.instances
          .filter(r => r.product_color_id === color._id)
          .map(r => Object.assign(r, {quantity: r.inventory.map(i => i.count - (i.reserved ? i.reserved : 0)).reduce((a, b) => a + b, 0)})),

        tags: item.tags,
        name: item.name,
        price: instance.price,
        discount: [1],
        thumbnail: color.image.thumbnail,
        product_color_id: instance.product_color_id,
      }));
    }
    this.cartItems.next(currentValue);
  }

  getLoyaltyBalance() {
    return new Promise((resolve, reject) => {
      this.httpService.get(`customer/balance`).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  calculateDiscount(considerCoupon = false) {
    let discountValue = 0;

    if (this.cartItems.getValue().length > 0) {
      this.cartItems.getValue().forEach(el => {
        let tempTotalDiscount = el.discount && el.discount.length > 0 ? el.discount.reduce((a, b) => a * b) : 0;

        if (el.coupon_discount) {
          if (considerCoupon)
            tempTotalDiscount *= el.coupon_discount;
        }

        tempTotalDiscount = Number(tempTotalDiscount.toFixed(5));
        discountValue += (el.price - tempTotalDiscount * el.price) * el.quantity;
      });
    }

    return discountValue;
  }

  calculateTotal() {
    if (this.cartItems && this.cartItems.getValue().length > 0) {
      return this.cartItems.getValue()
        .filter(el => el.count && el.quantity <= el.count)
        .map(el => el.price * el.quantity)
        .reduce((a, b) => (+a) + (+b), 0);

    }

    return 0;
  }

  addCoupon(coupon_code = '') {
    if (!this.authService.userIsLoggedIn())
      return Promise.reject(403);

    if (coupon_code.length <= 0)
      return Promise.resolve(false);

    return new Promise((resolve, reject) => {
      if (this.cartItems && this.cartItems.getValue().length > 0)
        this.httpService.post('coupon/code/valid', {
          product_ids: Array.from(new Set(this.cartItems.getValue().map(el => el.product_id))),
          coupon_code: coupon_code,
        }).subscribe(
          (data) => {
            data = data[0];
            const someItems = this.cartItems.getValue().filter(el => el.product_id === data.product_id);
            if (someItems && someItems.length > 0) {
              someItems.forEach(el => {
                el['coupon_discount'] = 1 - data.discount;
              });
              resolve(true);
            } else
              reject({});
          },
          (err) => {
            reject(err);
          });
    });
  }

  applyCoupon(coupon_code): any {
    if (!coupon_code)
      return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.httpService.post('coupon/code/apply', {
        coupon_code: coupon_code,
      }).subscribe(
        (data) => {
          resolve();
        },
        (err) => {
          reject(err);
        });
    });
  }

  getCheckoutItems() {
    return this.cartItems.getValue()
      .map(r => Object.assign({},
        {product_id: r.product_id, product_instance_id: r.instance_id, number: r.quantity}));
  }

  getOrderId() {
    if (this.cartItems.getValue().length)
      return this.cartItems.getValue()[0].order_id;
    return null;
  }

  // favorites
  saveFavoriteItem(favoriteItem) {
    if (this.authService.userIsLoggedIn())
      this.saveFavoriteItemToServer(favoriteItem);
  }

  private saveFavoriteItemToServer(favoriteItem) {
    this.httpService.post('wishlist', {
      product_id: favoriteItem.product_id,
      product_instance_id: favoriteItem.product_instance_id,
    }).subscribe(
      res => {
        this.snackBar.open(`محصول به لیست علاقمندیهای شما افزوده شد`, null, SNACK_CONFIG);
      },
      err => {
        console.error('Cannot save favorite item to server: ', err);
        if (err.error === 'Duplicate WishList Item is not allowed')
          this.snackBar.open(`این محصول از قبل به لیست علاقمندی های شما افزوده شده است`, null, SNACK_CONFIG);
        else
          this.snackBar.open(`محصول به لیست علاقمندیها افزوده نشد. لطفا دوباره تلاش کنید`, null, SNACK_CONFIG);
      });
  }
}
