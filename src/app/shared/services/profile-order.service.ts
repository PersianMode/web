import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpService} from './http.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ProfileOrderService {
  orderArray: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  wishListArray: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  orderData: any;
  constructor(private httpService: HttpService, private authService: AuthService) {
  }

  getAllOrders() {
    this.httpService.get('/orders').subscribe(
      (info) => {
        this.orderArray.next(info.orders);
      },
      (err) => {
        console.error('error');
      }
    );
  }
  getWishList() {
    this.httpService.get('/wishlist').subscribe(
      info => {
        this.wishListArray.next(info);
      },
      err => {
        console.error('error');
      });
  }
}


