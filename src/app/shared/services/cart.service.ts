import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CartService {
  cartItems: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private localStorageKey = 'cart';

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
                console.log('Cannot delete all items from localStorage: ', err);
              });
          }
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
    }
  }

  updateItem(value) {
    if (this.authService.isLoggedIn.getValue()) {

    } else {

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
          cartData = this.cartItems.next(this.getItemsFromStorage());

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
      objItem.discount = (el.discount && el.discount.length > 0) ?
        (objItem.price - (el.discount.reduce((a, b) => a * b) * objItem.price)) : 0;

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
      this.httpService.get(`customer/${this.authService.userDetails.userId}/balance`).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
