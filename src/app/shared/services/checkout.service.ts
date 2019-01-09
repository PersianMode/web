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
  private durations: any;
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


  constructor(private cartService: CartService, private httpService: HttpService,
              private authService: AuthService, private snackBar: MatSnackBar,
              private router: Router) {
    this.cartService.cartItems.subscribe(
      data => {
        this.dataIsReady.next(data && data.length);
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
    const validAddressObject = this.withDelivery ?
      (this.addressObj && this.deliveryDays && this.deliveryTime) :
      (this.addressObj && this.ccRecipientData);
    this.isValid$.next(this.total && validAddressObject && this.productData && this.productData.length);
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

  getDurations() {
    if (this.durations)
      return this.durations;

    return new Promise((resolve, reject) => {
      this.httpService.get('deliveryduration').subscribe(
        (data) => {
          this.durations = data;
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
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
    this.total = this.calculateTotal();
    this.discount = this.cartService.calculateDiscount(this.productData);
    return {
      total: this.total,
      discount: this.discount,
    };
  }

  calculateTotal(products = this.productData) {
    if (products && products.length > 0) {
      return products
        .filter(el => el.count && el.quantity <= el.count)
        .map(el => el.price * el.quantity)
        .reduce((a, b) => (+a) + (+b), 0);

    }

    return 0;
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

  // TODO: search for sendDataToBankGateway occurrence
  getDataFromServerToSendBank(data) {
    return new Promise((resolve, reject) => {
      this.httpService.post('prepareDataForBankGateway', data)
        .subscribe(res => {
            resolve(res);
          },
          err => {
            reject(err);
          });
    });
  }


  updateVariablesAfterCheckout() {
    if (!this.authService.userDetails.userId) {
      this.ccRecipientData = null;
      let addresses = [];
      if (!this.withDelivery) {
        addresses = this.warehouseAddresses.map(r => Object.assign({name: r.name}, r.address));
      }
      this.addresses$.next(addresses);
    }
    this.selectedCustomerAddress = -1;
    this.selectedWarehouseAddress = -1;
    this.withDelivery = true;
    this.deliveryDays = null;
    this.deliveryTime = null;
    this.addressObj = {};
    this.ccRecipientData = null;
    this.addedProvince = '';
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

  accumulateData() {
    if (!this.withDelivery) {
      this.addressObj.warehouse_name = this.addressObj.name;
      this.addressObj.warehouse_id = this.warehouseAddresses.find(x => x.address._id === this.addressObj._id)._id;
    }

    if (!this.withDelivery)
      if (this.ccRecipientData) {
        this.addressObj.recipient_name = this.ccRecipientData.recipient_name;
        this.addressObj.recipient_surname = this.ccRecipientData.recipient_surname;
        this.addressObj.recipient_national_id = this.ccRecipientData.recipient_national_id;
        this.addressObj.recipient_mobile_no = this.ccRecipientData.recipient_mobile_no;
        this.addressObj.recipient_title = this.ccRecipientData.recipient_title;
        this.addressObj.recipient_email = this.ccRecipientData.recipient_email ? this.ccRecipientData.recipient_email : null;
      } else {
        return;
      }
    return {
      cartItems: this.authService.userIsLoggedIn() ? {} : this.cartService.getCheckoutItems(),
      order_id: this.cartService.getOrderId(),
      address: this.addressObj,
      transaction_id: null,
      used_point: 0,
      used_balance: 0,
      total_amount: this.total,
      discount: this.discount,
      is_collect: !this.withDelivery,
      duration_days: this.withDelivery ? this.deliveryDays : null,
      time_slot: this.withDelivery ? this.deliveryTime : null,
      paymentType: this.selectedPaymentType,
      loyalty: this.earnSpentPointObj,
    };
  }

  checkoutDemo() {
    const data = this.accumulateDataDemo();
    this.httpService.post('checkoutDemo', data)
      .subscribe(res => {
          if (!this.authService.userDetails.userId) {
            this.ccRecipientData = null;
            let addresses = [];
            localStorage.removeItem('address');
            if (!this.withDelivery) {
              addresses = this.warehouseAddresses.map(r => Object.assign({name: r.name}, r.address));
            }
            this.addresses$.next(addresses);
          }
          this.cartService.emptyCart();
          this.router.navigate(['/', 'profile']);
        },
        err => console.error(err));
  }

  accumulateDataDemo() {
    if (!this.withDelivery) {
      this.addressObj.warehouse_name = this.addressObj.name;
      this.addressObj.warehouse_id = this.warehouseAddresses.find(x => x.address._id === this.addressObj._id)._id;
    }

    if (!this.withDelivery)
      if (this.ccRecipientData) {
        this.addressObj.recipient_name = this.ccRecipientData.recipient_name;
        this.addressObj.recipient_surname = this.ccRecipientData.recipient_surname;
        this.addressObj.recipient_national_id = this.ccRecipientData.recipient_national_id;
        this.addressObj.recipient_mobile_no = this.ccRecipientData.recipient_mobile_no;
        this.addressObj.recipient_title = this.ccRecipientData.recipient_title;
        this.addressObj.recipient_email = this.ccRecipientData.recipient_email ? this.ccRecipientData.recipient_email : null;
      } else {
        return;
      }
    return {
      cartItems: this.authService.userIsLoggedIn() ? {} : this.cartService.getCheckoutItems(),
      order_id: this.cartService.getOrderId(),
      address: this.addressObj,
      transaction_id: null,
      used_point: 0,
      used_balance: 0,
      total_amount: this.total,
      discount: this.discount,
      is_collect: !this.withDelivery,
      duration_days: this.withDelivery ? this.deliveryDays : null,
      time_slot: this.withDelivery ? this.deliveryTime : null,
      paymentType: this.selectedPaymentType,
      loyalty: this.earnSpentPointObj,
    };
  }

  readPayResult(bankData) {
    return new Promise((resolve, reject) => {
      this.httpService.post('payResult', bankData).subscribe(
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
