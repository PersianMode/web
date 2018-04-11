import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CartService {
  cartItems: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private localStorageKey = 'cart';
  coupon_discount = 0;

  constructor(private httpService: HttpService, private authService: AuthService) {
    this.authService.isLoggedIn.subscribe(
      (data) => {
        if (data) {
          // Read data from localStorage and save in server if any data is exist in localStorage
          const items = this.getItemsFromStorage();

          if (items && items.length > 0) {
            const promiseList = [];

            items.forEach(el => {
              promiseList.push(this.httpService.post('order', {
                product_id: el.product_id,
                product_instance_id: el.product_instance_id,
                number: el.number ? el.number : 1,
              }).toPromise());
            });


            Promise.all(promiseList)
              .then(res => {
                localStorage.removeItem(this.localStorageKey);
              })
              .catch(err => {
                localStorage.removeItem(this.localStorageKey);
                console.error('orders error: ', err);
              });
          }
        } else {
          this.cartItems.next([]);
        }
      }
    );
  }

  removeItem(value) {
    if (this.authService.isLoggedIn.getValue()) {
      // Update server
      this.httpService.post('order/delete', {
        product_instance_id: value.instance_id,
      }).subscribe(
        (data) => {
          this.cartItems.next(this.cartItems.getValue().filter(el => el.instance_id.toString() !== value.instance_id.toString()));
        },
        (err) => {
          console.error('Cannot delete item from cart: ', err);
        });
    } else {
      // Update local storage
      let tempItems = this.getItemsFromStorage();
      tempItems = tempItems.filter(el => el.product_id.toString() !== value.product_id.toString()
        && el.instance_id.toString() !== value.instance_id.toString());

      localStorage.setItem(this.localStorageKey, JSON.stringify(tempItems));

      this.cartItems.next(this.cartItems.getValue().filter(el => el.instance_id.toString() !== value.instance_id.toString()));
    }
  }

  updateItem(value) {
    // Check for update or delete and add new item
    const item = this.cartItems.getValue().find(el => el.product_id.toString() === value.product_id.toString() &&
      el.instance_id.toString() === value.instance_id.toString());

    if (item) {
      // Should modify
      if (this.authService.isLoggedIn.getValue()) {
        // Modify in server
        const diff = (item.quantity || 1) - (value.number || 1);

        this.httpService.post('order' + (diff > 0 ? '/delete' : ''), {
          product_id: item.product_id,
          product_instance_id: item.instance_id,
          number: Math.abs(diff),
        }).subscribe(
          (data) => {
            item.quantity = value.number || 1;
            this.cartItems.next(this.cartItems.getValue());
          },
          (err) => {
            console.error('Cannot update (reduce quantity) in server: ', err);
          }
        );
      } else {
        // Modify in localStorage
        item.quantity = value.number || 1;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems.getValue()));
        this.cartItems.next(this.cartItems.getValue());
      }
    } else {
      // Should delete and add new product's instance
      if (this.authService.isLoggedIn.getValue()) {
        // Change in server
        this.httpService.post('order/delete', {
          product_instance_id: value.pre_instance_id,
        }).subscribe(
          (data) => {
            this.httpService.post('order', {
              product_id: value.product_id,
              product_instance_id: value.instance_id,
              number: value.number
            }).subscribe(
              (dt) => {
                this.getCartItems();
              },
              (err) => {
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
        ls_items = ls_items.filter(el =>
          el.product_id.toString() !== value.product_id.toString() ||
          el.instance_id.toString() !== value.pre_instance_id.toString());

        for (let counter = 0; counter < value.number; counter++)
          ls_items.push({
            product_id: value.product_id,
            instance_id: value.instance_id,
          });

        localStorage.setItem(this.localStorageKey, JSON.stringify(ls_items));
        this.getCartItems();
      }
    }
  }

  saveItem(item) {
    if (this.authService.isLoggedIn.getValue()) {
      // Update order in server
      this.saveItemToServer(item);
    } else {
      // Save data on storage
      this.saveItemToStorage(item);
    }
  }

  getCartItems() {
    this.authService.isLoggedIn.subscribe(
      (data) => {
        let cartData = null;
        if (!data)
          cartData = this.getItemsFromStorage();

        if (data || cartData && cartData.length > 0)
          this.getItemsDetail(cartData)
            .then(res => {
              this.setCartItem(res, false);
            })
            .catch(err => {
              console.error('Cannot fetch cart items: ', err);
            });
      }
    );
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

      objItem.product_id = el.product_id;
      objItem.instance_id = el.instance_id;
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
    return new Promise((resolve, reject) => {
      this.httpService.post('order', {
        product_id: item.product_id,
        product_instance_id: item.product_instance_id,
        number: item.number,
      }).subscribe(
        data => {
          this.cartItems.next(this.cartItems.getValue().concat([Object.assign({quantity: item.number}, item)]));
          resolve(data);
        },
        err => {
          console.error('Cannot save item to server: ', err);
          reject(err);
        });
    });
  }

  private saveItemToStorage(item) {
    const data = this.getItemsFromStorage();
    data.push(item);
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    this.cartItems.next(this.cartItems.getValue().concat([Object.assign({quantity: item.number}, item)]));
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
    if (!this.authService.isLoggedIn.getValue())
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
            const someItems = this.cartItems.getValue().filter(el => el.product_id.toString() === data.product_id.toString());
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
}
