import {Injectable} from '@angular/core';
import {IAddressInfo} from '../interfaces/iaddressInfo.interface';
import {HttpService} from './http.service';
import {CartService} from './cart.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PaymentType} from '../enum/payment.type.enum';
import {AuthService} from './auth.service';
import {MatSnackBar} from '@angular/material';

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
  addressState = null;
  customerAddresses = [];
  warehouseAddresses = [];

  addressData: IAddressInfo;
  addresses$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private cartService: CartService, private httpService: HttpService,
              private authService: AuthService, private snackBar: MatSnackBar) {
    this.cartService.cartItems.subscribe(
      (data) => this.dataIsReady.next((data && data.length > 0) ? true : false)
    );
    this.authService.isLoggedIn.subscribe( isLoggedIn => {
      this.getCustomerAddresses(isLoggedIn);
    });

    this.httpService.get('warehouse').subscribe(res => {
      this.warehouseAddresses = res;
    });
  }

  getCustomerAddresses (isLoggedIn = this.authService.isLoggedIn.getValue()){
    if (isLoggedIn) {
      this.httpService.get(`customer/address`)
        .subscribe(res => this.addresses$.next(res.addresses), err => console.error(err));
    } else {
      const address = JSON.parse(localStorage.getItem('address'));
      if (address) {
        this.addresses$.next([address]);
      }
    }
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

  submitAddresses(data): Promise<any> {
    if (!data)
      return Promise.reject('');

    if (this.authService.isLoggedIn.getValue()) {
      return new Promise((resolve, reject) => {
        this.httpService.post('user/address', data).subscribe(
          res => {
            resolve();
          }, err => {
            reject(err);
          }
        );
      });
    } else {
      try {
        localStorage.setItem('address', JSON.stringify(data));
        return Promise.resolve();
      } catch(e) {
        this.snackBar.open('ذخیره آدرس در حالت Private و بدون login ممکن نیست.', null, {
          duration: 2000,
        });
        return Promise.reject('');
      }
    }
  }
}
