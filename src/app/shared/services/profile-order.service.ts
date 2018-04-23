import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpService} from './http.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ProfileOrderService {
  orderArray: BehaviorSubject<any> = new BehaviorSubject<any>({});
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
}


//
// import {Injectable} from '@angular/core';
// import {AuthService} from './auth.service';
// import {HttpService} from './http.service';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {ReplaySubject} from 'rxjs/ReplaySubject';
//
// @Injectable()
// export class ProfileOrderService {
//   orderArray: BehaviorSubject<any> = new BehaviorSubject<any>({});
//   orderData: any;
//   constructor(private httpService: HttpService, private authService: AuthService) {
//   }
//
//   getAllOrders() {
//     this.httpService.get('/orders').subscribe(
//       (info) => {
//         this.orderArray.next(info.orders);
//       },
//       (err) => {
//         console.error('error');
//       }
//     );
//   }
//
//   selectOrder(orderId) {
//     this.orderData.next(this.orderArray.getValue().find(el => el._id === orderId));
//   }
// }

