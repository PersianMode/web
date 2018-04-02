import {Injectable} from '@angular/core';
import {IAddressInfo} from '../interfaces/iaddressInfo.interface';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';
import {CartService} from './cart.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PaymentType} from '../enum/payment.type.enum';

@Injectable()
export class CheckoutService {
  dataIsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private paymentType = PaymentType;
  private selectedPaymentType = this.paymentType.cash;
  private loyaltyValue = 1000;
  private total = 0;
  private discount = 0;
  private loyaltyPointValue = 0;
  private balance = 0;

  addressData: IAddressInfo;

  constructor(private cartService: CartService,
              private httpService: HttpService,
              private authService: AuthService) {
    this.cartService.cartItems.subscribe(
      (data) => this.dataIsReady.next((data && data.length > 0) ? true : false)
    );
  }

  setPaymentType(pt) {
    this.selectedPaymentType = pt;
  }

  getLoyaltyBalance() {
    return new Promise((resolve, reject) => {
      this.cartService.getLoyaltyBalance()
        .then((res: any) => {
          this.balance = res.balance;
          this.loyaltyPointValue = res.loyalty_points * this.loyaltyValue;

          resolve({
            balance: this.balance,
            loyaltyPointValue: this.loyaltyPointValue,
          });
        })
        .catch(err => reject(err));
    });
  }

  getTotalDiscount() {
    this.total = this.cartService.calculateTotal();
    this.discount = this.cartService.calculateDiscount(true);

    return {
      total: this.total,
      discount: this.discount,
    };
  }

  submitAddresses(data) {
    return new Promise((resolve, reject) => {
      if (!data)
        return Promise.reject(false);

      console.log('***', data);
      this.httpService.post('user/address', {
        username: this.authService.userDetails.username,
        body: data,
      }).subscribe(
        res => {
          resolve();
        }, err => {
          reject(err);
        }
      );
    });
  }
}
