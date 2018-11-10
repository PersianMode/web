import {Injectable} from '@angular/core';
import {IAddressInfo} from '../interfaces/iaddressInfo.interface';
import {HttpService} from './http.service';
import {CartService} from './cart.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PaymentType} from '../enum/payment.type.enum';
import {AuthService} from './auth.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {ReplaySubject} from 'rxjs/Rx';
import {isUndefined} from 'util';

@Injectable()
export class CheckoutService {
  dataIsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private productData;
  private paymentType = PaymentType;
  private selectedPaymentType = this.paymentType.cash;
  private loyaltyValue = 0;
  private total = 0;
  private discount = 0;
  private loyaltyPointValue = 0;
  private balance = 0;
  private earnSpentPointObj: any = {};
  loyaltyGroups: ReplaySubject<any> = new ReplaySubject<any>();
  addPointArray: ReplaySubject<any> = new ReplaySubject<any>();

  warehouseAddresses = [];
  private _ads: any = null;
  addressData: IAddressInfo;
  addresses$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ccRecipientData: any = {};


  constructor(private cartService: CartService, private httpService: HttpService,
              private authService: AuthService, private snackBar: MatSnackBar,
              private router: Router) {
    this.cartService.cartItems.subscribe(
      data => this.dataIsReady.next(data && data.length)
    );
    this.authService.isVerified.subscribe(isLoggedIn => {
      this.getCustomerAddresses(this.authService.userIsLoggedIn());
      this.getLoyaltyGroup();
      this.getAddLoyaltyPoints();
    });

    this.httpService.get('warehouse').subscribe(res => {
      this.warehouseAddresses = res;
    });
  }

  set addressState(ads) {
    this._ads = ads;
    this.checkValidity();
  }

  get addressState() {
    return this._ads;
  }

  private checkValidity() {
    const data = this.accumulateData();
    const il = this.authService.userIsLoggedIn();
    this.isValid$.next(data.total_amount &&
      (il || (data.customerData && data.cartItems && data.cartItems.length)) && (!il || data.order_id));
  }

  getCustomerAddresses(isLoggedIn = this.authService.userIsLoggedIn()) {
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

  setProductData(data) {
    this.productData = data;
  }

  setPaymentType(pt) {
    this.selectedPaymentType = pt;
  }

  setEarnSpentPoint(et) {
    this.earnSpentPointObj = {
      delivery_spent: 0,
      shop_spent: 0,
      delivery_value: 0,
      shop_value: 0,
      earn_point: et,
    };
  }

  finalCheck() {
    const cartItems = this.productData
      .map(r => Object.assign({}, {
        product_id: r.product_id,
        product_instance_id: r.instance_id,
        price: r.price,
        count: r.count - (r.reserved ? r.reserved : 0),
        quantity: r.quantity,
        discount: r.discount
      }));
    return this.httpService.post('finalCheck', cartItems);

  }

  getLoyaltyBalance() {
    return new Promise((resolve, reject) => {
      this.cartService.getLoyaltyBalance()
        .then((res: any) => {
          this.balance = res.balance;
          // this.loyaltyPointValue = res.loyalty_points * this.loyaltyValue;
          this.loyaltyPointValue = res.loyalty_points;

          resolve({
            balance: this.balance,
            loyaltyPointValue: this.loyaltyPointValue,
          });
        })
        .catch(err => reject(err));
    });
  }

  getLoyaltyGroup() {
    this.httpService.get('loyaltygroup')
      .subscribe(res => {
          this.loyaltyGroups.next(res);
        },
        err => {
          console.error('Cannot get loyalty groups: ', err);
          this.snackBar.open('قادر به دریافت اطلاعات گروه های وفاداری نیستیم. دوباره تلاش کنید', null, {
            duration: 3200,
          });
        });
  }


  getAddLoyaltyPoints() {
    this.httpService.get('deliverycc')
      .subscribe(res => {
          this.addPointArray.next(res);
        },
        err => {
          console.error('Cannot get loyalty groups: ', err);
          this.snackBar.open('قادر به دریافت اطلاعات گروه های وفاداری نیستیم. دوباره تلاش کنید', null, {
            duration: 3200,
          });
        });
  }

  getTotalDiscount() {
    this.total = this.cartService.calculateTotal(this.productData);
    this.discount = this.cartService.calculateDiscount(this.productData, true);
    return {
      total: this.total,
      discount: this.discount,
    };
  }

  submitAddresses(data): Promise<any> {
    if (!data) {
      return Promise.reject('');
    }
    if (this.authService.userIsLoggedIn()) {
      return new Promise((resolve, reject) => {
        this.httpService.post('user/address', data).subscribe(
          () => {
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
      } catch (e) {
        this.snackBar.open('ذخیره آدرس در حالت Private و بدون login ممکن نیست.', null, {
          duration: 2000,
        });
        return Promise.reject('');
      }
    }
  }

  private get customerData() {
    return this._ads[3];
  }

  private get address() {
    return this._ads[4];
  }

  private get is_collect() {
    return !this._ads[0];
  }

  private get delivery_days() {
    return this._ads[5];
  }

  private get time_slot() {
    return this._ads[6];
  }

  private accumulateData() {
    if (!this.is_collect) {
      this.ccRecipientData = null;
    } else if (this.ccRecipientData) {
      this.address.recipient_name = this.ccRecipientData.recipient_name;
      this.address.recipient_surname = this.ccRecipientData.recipient_surname;
      this.address.recipient_national_id = this.ccRecipientData.recipient_national_id;
      this.address.recipient_mobile_no = this.ccRecipientData.recipient_mobile_no;
      this.address.recipient_title = this.ccRecipientData.recipient_title;
      this.address.recipient_email = this.ccRecipientData.recipient_email ? this.ccRecipientData.recipient_email : null;
    } else if (this.is_collect && !this.ccRecipientData) {
      return;
    }
    return {
      cartItems: this.authService.userIsLoggedIn() ? {} : this.cartService.getCheckoutItems(),
      order_id: this.cartService.getOrderId(),
      address: this.address,
      customerData: this.customerData,
      transaction_id: 'xyz' + Math.floor(Math.random() * 100000),
      used_point: 0,
      used_balance: 0,
      total_amount: this.total,
      discount: this.discount,
      is_collect: this.is_collect,
      duration_days: this.delivery_days,
      time_slot: this.time_slot,
      paymentType: this.selectedPaymentType,
      loyalty: this.earnSpentPointObj,
    };
  }

  checkout() {
    const data = this.accumulateData();
    this.httpService.post('checkout', data)
      .subscribe(res => {
          this.cartService.emptyCart();
          this.router.navigate(['/', 'profile']);
        },
        err => console.error(err));
  }

  calculateDeliveryDiscount(durationId) {
    let data = {
      customer_id: this.authService.userDetails.userId ? this.authService.userDetails.userId : null,
      duration_id: durationId
    };
    return new Promise((resolve, reject) => {
      this.httpService.post('/calculate/order/price', data)
        .subscribe(res => {
            resolve(res);
          },
          err => {
            reject();
          });
    });
  }
}
