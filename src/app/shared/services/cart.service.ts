import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class CartService {
  cartItems: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(private httpService: HttpService, private authService: AuthService) {
    this.authService.isLoggedIn.subscribe(
      (data) => {
        if (data) {
          // Read data from localStorage and save in server
        }
      }
    );
  }

  saveItem(item) {
    //  if (this.authService.isLoggedIn.getValue()) {
    //   // Update order in server
    // } else {
    //   // Save data on storage
    //   this.saveItemOnStorage(item);
    // }
  }

  getCartItems() {
    this.authService.isLoggedIn.subscribe(
      (data) => {
        let cartData = null;
        if (!data)
          cartData = this.cartItems.next(this.getCartFromStorage());

        if (data || cartData.length > 0)
          this.httpService.post('cart/items', {data: cartData}).subscribe(
            (rs) => {
              console.log('Received results: ', rs);
              this.cartItems = rs;
            },
            (err) => {
              console.error('Cannot fetch cart items: ', err);
            }
          );
      }
    );
  }

  private getCartFromStorage() {
    return JSON.parse(localStorage.getItem('cart')) === null ? [] : JSON.parse(localStorage.getItem('cart'));
  }

  private saveItemOnStorage(item) {
    const data = this.getCartFromStorage();
    data.push(item);
    localStorage.setItem('cart', JSON.stringify(data));
    this.cartItems.next(data);
  }
}
