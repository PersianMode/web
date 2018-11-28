import { Injectable } from '@angular/core';
import { IAddressInfo } from '../interfaces/iaddressInfo.interface';
import { HttpService } from './http.service';
import { CartService } from './cart.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PaymentType } from '../enum/payment.type.enum';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs/Rx';
import { SpinnerService } from './spinner.service';

@Injectable()
export class CheckoutService {
  dataIsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private productData;
  private paymentType = PaymentType;
  private selectedPaymentType = this.paymentType.cash;
  private total = 0;
  private discount = 0;
  private loyaltyPointValue = 0;
  private balance = 0;
  private earnSpentPointObj: any = {};
  loyaltyGroups: ReplaySubject<any> = new ReplaySubject<any>();
  addPointArray: ReplaySubject<any> = new ReplaySubject<any>();
  warehouseAddresses = [];
  addressData: IAddressInfo;

  addresses$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  isValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ccRecipientData: any = null;
  addedProvince: any = null;

  withDelivery: any = true;
  selectedCustomerAddress = -1;
  selectedWarehouseAddress = -1;
  deliveryDays: any = null;
  deliveryTime: any = null;
  addressObj: any = {};
  cartItems: any = {};
checkcart:any ={};

  constructor(private cartService: CartService, private httpService: HttpService,
    private authService: AuthService, private snackBar: MatSnackBar, private spinnerService: SpinnerService,
    private router: Router) {
    this.cartService.cartItems.subscribe(
      data => {
        this.checkcart = data;
         this.dataIsReady.next(data && data.length)
      }

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

  checkValidity() {
   
      const isValid = this.withDelivery ? (this.addressObj && this.deliveryDays && this.deliveryTime && this.cartItems && this.checkcart && this.checkcart.length) : (this.addressObj && this.ccRecipientData && this.cartItems && this.checkcart && this.checkcart.length);
      this.isValid$.next(this.total && isValid);
      console.log(this.checkcart);
  }

  getCustomerAddresses(isLoggedIn = this.authService.userIsLoggedIn()) {
    if (isLoggedIn) {
      this.httpService.get(`customer/address`)
        .subscribe(res => {
          this.addresses$.next(res.addresses);
        }, err => {
          console.error(err);
        }
        );
    } else {
      const address = JSON.parse(localStorage.getItem('address'));
      this.addresses$.next(address && Object.keys(address).length ? [address] : []);
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
    let cartItems: any = {};
    if (this.productData) {
      cartItems = this.productData.map(r => Object.assign({}, {
        product_id: r.product_id,
        product_instance_id: r.instance_id,
        price: r.price,
        count: r.count - (r.reserved ? r.reserved : 0),
        quantity: r.quantity,
        discount: r.discount
      }));
    }
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

  checkout() {
    const data = this.accumulateData();
    this.httpService.post('checkout', data)
      .subscribe(res => {
        if (!this.authService.userDetails.userId) {
          this.ccRecipientData = null;
          let addresses = [];
          localStorage.removeItem('address');
          if (!this.withDelivery) {
            addresses = this.warehouseAddresses.map(r => Object.assign({ name: r.name }, r.address));
          }
          this.addresses$.next(addresses);
        }
        this.cartService.emptyCart();
        this.selectedCustomerAddress = -1;
        this.selectedWarehouseAddress = -1;
        this.withDelivery = true;
        this.deliveryDays = null;
        this.deliveryTime = null;
        this.addressObj = {};
        this.ccRecipientData = null;
        this.addedProvince = '';
        this.router.navigate(['/', 'profile']);
      },
        err => console.error(err));
  }

  calculateDeliveryDiscount(durationId) {
    const data = {
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

  private accumulateData() {

    if (!this.withDelivery) {
      this.addressObj.wharehouse_name = this.addressObj.name;
      delete this.addressObj.name;
    }

    if (!this.withDelivery && this.ccRecipientData) {
      this.addressObj.recipient_name = this.ccRecipientData.recipient_name;
      this.addressObj.recipient_surname = this.ccRecipientData.recipient_surname;
      this.addressObj.recipient_national_id = this.ccRecipientData.recipient_national_id;
      this.addressObj.recipient_mobile_no = this.ccRecipientData.recipient_mobile_no;
      this.addressObj.recipient_title = this.ccRecipientData.recipient_title;
      this.addressObj.recipient_email = this.ccRecipientData.recipient_email ? this.ccRecipientData.recipient_email : null;
    } else if (!this.withDelivery && !this.ccRecipientData) {
      return;
    }
    ;
    return {
      cartItems: this.authService.userIsLoggedIn() ? {} : this.cartService.getCheckoutItems(),
      order_id: this.cartService.getOrderId(),
      address: this.addressObj,
      customerData: this.addressObj,
      transaction_id: 'xyz' + Math.floor(Math.random() * 100000),
      used_point: 0,
      used_balance: 0,
      total_amount: this.total,
      discount: this.discount,
      is_collect: !this.withDelivery,
      duration_days: this.deliveryDays,
      time_slot: this.deliveryTime,
      paymentType: this.selectedPaymentType,
      loyalty: this.earnSpentPointObj,
    };
  }

}
