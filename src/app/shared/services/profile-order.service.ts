import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {HttpService} from './http.service';
import {reject} from 'q';

@Injectable()
export class ProfileOrderService {
   orderArray: any;
  constructor(private httpService: HttpService, private authService: AuthService) {
  }

  getAllOrders() {
    this.authService.isLoggedIn.subscribe(
      (data) => {
        this.httpService.get('/orders').subscribe(
          (info) => {
            console.log('orders : ', info);
            this.orderArray = info;
          },
          (err) => {
            console.log('errorrr');
          }
        );
      }
    );

  }
}
