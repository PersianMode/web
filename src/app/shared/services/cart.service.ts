import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ProductService} from './product.service';
import {getDiscounted} from '../lib/discountCalc';
import {SpinnerService} from './spinner.service';

const SNACK_CONFIG: MatSnackBarConfig = {
  duration: 3200,
  direction: 'rtl',
};

@Injectable()
export class CartService {
  cartItems: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  used_coupon_code$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private localStorageKey = 'cart';
  coupon_discount = 0;
  itemAdded$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private httpService: HttpService,
    private authService: AuthService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService) {
    this.authService.isLoggedIn.subscribe(
      async isLoggedIn => {
        // Read data from localStorage and save in server if any data is exist in localStorage
        const items = this.getItemsFromStorage();
        if (this.authService.userIsLoggedIn()) {
          if (items && items.length) {
            for (let i = items.length - 1; i >= 0; i--) {
              await this.saveLocalStorageCartsToServer(items[i]);
              items.splice(i, 1);
              try {
                localStorage.setItem(this.localStorageKey, JSON.stringify(items));
              } catch (e) {
                console.error('could not update local storage after login', e);
              }
            }
          }
          this.getUserCart();
        } else if (items && items.length) {
          this.getItemsDetail(items);
        } else {
          this.setCartItem(null, [], false);
        }
      });
  }

  async saveLocalStorageCartsToServer(item) {
    return new Promise((resolve, reject) => {
      this.httpService.post('order', {
        product_id: item.product_id,
        product_instance_id: item.instance_id,
        number: item.quantity,
      }).subscribe((res) => {
        resolve(res);
      },
        (err) => {
          console.error('orders error: ', item, err);
          reject(err);
        }
      );
    });
  }

  loadCartsForShopRes() {
    const items = this.getItemsFromStorage();
    if (this.authService.userIsLoggedIn()) {
      this.getUserCart();
    } else if (items && items.length) {
      this.getItemsDetail(items);
    }
  }


  getUserCart() {
    this.httpService.get('cart/items').subscribe(
      res => {
        const coup_code = res[0] && res[0]['coupon_code'] || '';
        this.used_coupon_code$.next(coup_code);
        this.getItemsDetail(res);
      }, err => {
        console.error('could not load cart items: ', err);
      });
  }

  getItemsDetail(overallDetails) {
    this.productService.loadProducts(overallDetails.map(x => x.product_id))
      .then(res => {
        try {
          this.setCartItem(overallDetails, res, false);
        } catch (err) {
          console.error('-> ', err);
        }
      })
      .catch(err => {
        try {
          this.setCartItem(null, [], false);
        } catch (err) {
          console.error('-> ', err);
        }
      });
  }

  emptyCart() {
    this.cartItems.next([]);
    this.clearCoupon();
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
        || el.instance_id !== value.instance_id);

      try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(tempItems));
        this.cartItems.next(this.cartItems.getValue().filter(el => el.instance_id !== value.instance_id));
      } catch (e) {
        this.snackBar.open('ذخیره سبد در حالت Private و بدون login ممکن نیست.', null, SNACK_CONFIG);
      }
    }
  }

  getNumber() {
    return this.cartItems.getValue().map(r => r.quantity).reduce((a, b) => a + b, 0);
  }

  updateItem(value) {
    let items = this.cartItems.getValue();
    const instanceChange = value.instance_id !== value.pre_instance_id;
    const update = () => {
      const curInstance = items.find(el => el.product_id === value.product_id && el.instance_id === value.instance_id);
      const newInstance = items.find(el => el.product_id === value.product_id && el.instance_id === value.pre_instance_id);
      const product = curInstance || newInstance;
      Object.assign(product, {
        product_id: value.product_id,
        instance_id: value.instance_id,
        quantity: instanceChange && curInstance ? value.number + curInstance.quantity : value.number,
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

  addItem(item) {
    this.itemAdded$.next(false);
    if (this.authService.userIsLoggedIn()) {
      // Update order in server
      this.addCartItemToServer(item);
    } else {
      // Save data on storage
      this.addCartItemToStorage(item);
    }
  }


  private setCartItem(overallDetails, products, isUpdate = true) {
    const itemList = [];

    if (!products || products.length <= 0)
      overallDetails = [];

    this.productService.updateProducts(products);

    overallDetails.forEach(el => {
      if (!el.instance_id)
        el.instance_id = el._id;
      const foundProduct = products.find(i => i._id === el.product_id);
      if (foundProduct) {
        itemList.push({
          'instance_id': el.instance_id,
          'order_id': el.order_id,
          'product_id': el.product_id,
          'quantity': el.quantity
        });
      }
    });

    if (isUpdate)
      this.cartItems.next(this.cartItems.getValue().concat(itemList));
    else
      this.cartItems.next(itemList);
    if (this.used_coupon_code$.getValue()) this.addCoupon(this.used_coupon_code$.getValue());
  }

  private getItemsFromStorage() {
    return JSON.parse(localStorage.getItem(this.localStorageKey)) === null ? [] : JSON.parse(localStorage.getItem(this.localStorageKey));
  }

  private addCartItemToServer(item) {
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

  private addCartItemToStorage(item) {
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
      currentValue.push(object);
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

  calculateDiscount(cartData) {
    if (!cartData || !cartData.length) return;

    const base = cartData.map(r => (r.price || 0) * (r.quantity || 1)).reduce((x, y) => x + y, 0);
    let dc = cartData
      .map(r => Object.assign({
        p: r.price || 0,
        d: r.discountedPrice || 0,
        q: r.quantity || 1,
      }))
      .map(r => r.q * (r.p - r.d))
      .reduce((x, y) => x + y, 0);

    if (this.coupon_discount >= 100) {
      dc += this.coupon_discount;
    } else if (this.coupon_discount > 0) {
      dc += getDiscounted(base - dc, this.coupon_discount);
    }
    return dc;
  }

  // check validity of coupon
  addCoupon(coupon_code = '') {
    if (!this.authService.userIsLoggedIn())
      return Promise.reject(403);

    if (coupon_code.length <= 0)
      return Promise.resolve(false);

    return new Promise((resolve, reject) => {
      if (this.cartItems && this.cartItems.getValue().length > 0) {
        this.spinnerService.enable();
        this.httpService.post('coupon/code/valid', {
          coupon_code: coupon_code,
        }).subscribe(
          data => {
            this.spinnerService.disable();
            if (!data) {
              this.snackBar.open('کوپن وجود ندارد یا منقضی شده است', null, {duration: 2700});
              this.coupon_discount = 0;
              return Promise.reject('invalid coupon');
            }
            this.coupon_discount = data['discount_ref'] || 0;
            this.used_coupon_code$.next(coupon_code);
            resolve(data);
          },
          err => {
            this.spinnerService.disable();
            this.snackBar.open('کوپن وجود ندارد یا منقضی شده است', null, {duration: 2700});
            this.coupon_discount = 0;
            reject(err);
          });
      }
    });
  }

  // final application of coupon on order
  applyCoupon(coupon_code): any {
    if (!coupon_code)
      return Promise.resolve();
    return new Promise((resolve, reject) => {
      this.spinnerService.enable();
      this.httpService.post('coupon/code/apply', {
        coupon_code: coupon_code,
      }).subscribe(
        data => {
          this.spinnerService.disable();
          this.used_coupon_code$.next(coupon_code);
          resolve(data);
        },
        err => {
          this.spinnerService.disable();
          reject(err);
        });
    });
  }

  clearCoupon() {
    this.used_coupon_code$.next('');
    this.coupon_discount = 0;
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
      product_color_id: favoriteItem.product_color_id,
    }).subscribe(
      res => {
        this.snackBar.open(`محصول به لیست علاقمندی‌های شما افزوده شد`, null, SNACK_CONFIG);
      },
      err => {
        console.error('Cannot save favorite item to server: ', err);
        if (err.error === 'Duplicate WishList Item is not allowed')
          this.snackBar.open(`این محصول از قبل به لیست علاقمندی‌های شما افزوده شده است`, null, SNACK_CONFIG);
        else
          this.snackBar.open(`محصول به لیست علاقمندیها افزوده نشد. لطفا دوباره تلاش کنید`, null, SNACK_CONFIG);
      });
  }
}
