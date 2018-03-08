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
          // Get data from server
        } else {
          // Get data from storage
          this.cartItems.next(this.getCartFromStorage());
        }
      }
    );
  }

  saveItem(item) {
    if (this.authService.isLoggedIn._getNow()) {
      // Update order in server
    } else {
      // Save data on storage
      this.saveItemOnStorage(item);
    }
  }

  getCartItems() {
    if (!this.authService.isLoggedIn._getNow()) {
      this.getCartFromStorage();
    }

    // Get order-line details or all order details
  }

  private getCartFromStorage() {
    return JSON.parse(localStorage.getItem('cart'));
  }

  private saveItemOnStorage(item) {
    const data = JSON.parse(this.getCartFromStorage());
    data.push(item);
    localStorage.setItem('cart', JSON.stringify(data));
  }
}
