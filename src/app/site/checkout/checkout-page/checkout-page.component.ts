import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaymentType} from '../../../shared/enum/payment.type.enum';
import {CheckoutService} from '../../../shared/services/checkout.service';
import {HttpService} from '../../../shared/services/http.service';
import {CartService} from '../../../shared/services/cart.service';
import {TitleService} from '../../../shared/services/title.service';
import {ProductService} from '../../../shared/services/product.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CheckoutWarningConfirmComponent} from '../checkout-warning-confirm/checkout-warning-confirm.component';
import {Router} from '@angular/router';

import {ProgressService} from '../../../shared/services/progress.service';
import {AuthService} from '../../../shared/services/auth.service';
import {DOCUMENT, Location} from '@angular/common';
import {SpinnerService} from '../../../shared/services/spinner.service';
import {priceFormatter} from '../../../shared/lib/priceFormatter';
import {FREE_DELIVERY_AMOUNT} from 'app/shared/enum/delivery.enum';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  @ViewChild('bankDataFormId') bankDataFormId: ElementRef;
  @ViewChild('invoiceNumber') invoiceNumber: ElementRef;
  @ViewChild('invoiceDate') invoiceDate: ElementRef;
  @ViewChild('amount') amount: ElementRef;
  @ViewChild('terminalCode') terminalCode: ElementRef;
  @ViewChild('merchantCode') merchantCode: ElementRef;
  @ViewChild('redirectAddress') redirectAddress: ElementRef;
  @ViewChild('timeStamp') timeStamp: ElementRef;
  @ViewChild('action') action: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('sign') sign: ElementRef;

  total = 0;
  discount = 0;
  deliveryDiscount = 0;
  deliveryCost = 0;
  usedBalance = 0;
  balanceValue = 0;
  usedLoyaltyPoint = 0;
  loyaltyPoint = 0;
  disabled = false;
  changeMessage = '';
  soldOuts: any[] = [];
  discountChanges: any[];
  priceChanges: any[];
  showCostLabel: true;
  noDuration = null;
  loyaltyGroups = [];
  addPointArray = [];
  selectedPaymentType = PaymentType.cash;
  earnedLoyaltyPoint = 0;
  system_offline_offer = 25000;
  loyaltyValue = 400;  // system_offline offers this
  showEarnPointLabel = true;
  bankData: any = null;
  isDev: boolean = true;

  cartItems$;
  products;

  constructor(private checkoutService: CheckoutService,
              private httpService: HttpService,
              private authService: AuthService,
              private dialog: MatDialog,
              private cartService: CartService,
              private titleService: TitleService,
              private progressService: ProgressService,
              private snackBar: MatSnackBar,
              private spinnerService: SpinnerService,
              private router: Router, @Inject(DOCUMENT) private document: any, private location: Location,
              private productService: ProductService) {
  }

  ngOnInit() {
    this.isDev = this.httpService.isInDevMode();
    this.titleService.setTitleWithConstant('پرداخت هزینه');
    this.checkoutService.dataIsReady.subscribe(
      data => {
        if (!data) return;

        const totalDiscount = this.checkoutService.getTotalDiscount();
        this.changePaymentType(this.selectedPaymentType);
        this.total = totalDiscount.total;
        this.discount = totalDiscount.discount;
      }
    );

    this.cartItems$ = this.cartService.cartItems.subscribe(carts => {
      const productIds = [];
      carts.forEach(p => productIds.push(p.product_id));
      this.spinnerService.enable();
      this.productService.loadProducts(productIds).then((data: any[]) => {
        this.loadAndFillProductsAndPrice(carts, data);
        this.calculateEarnPoint();
        this.checkoutService.getTotalDiscount();
        this.spinnerService.disable();
      }).catch(err => {
        this.spinnerService.disable();
        console.error('error in getting cart items: ', err);
      });
    });

    this.finalCheckItems();

    this.checkoutService.isValid$.subscribe(r => {
      this.disabled = !(r && (!this.soldOuts || !this.soldOuts.length));
    });

    this.calculateEarnPoint();
    this.authService.isLoggedIn.subscribe(res => {
      this.setPoints();
      this.calculateEarnPoint();
    });

    // this.checkoutService.setPaymentType(this.paymentType.cash);
    this.checkoutService.setPaymentType(this.selectedPaymentType);

    if (this.checkoutService.deliveryDurationId)
      this.calculateDiscount(this.checkoutService.deliveryDurationId);

    this.changePaymentType(this.selectedPaymentType);
  }

  loadAndFillProductsAndPrice(carts, data) {
    const allProducts = [];
    carts.forEach(p => {
      const item = {};
      const product = data.filter(e => e._id === p.product_id)[0];
      const instance = product.instances.find(i => i._id === p.instance_id) || {inventory: []};
      const color = product.colors.find(c => c._id === instance.product_color_id) || {image: {}};
      const instances = [];
      product.instances.forEach(inst => {
        const newInstance = {
          'price': inst.price,
          'size': inst.size,
          'instance_id': inst._id
        };
        newInstance['quantity'] = 0;
        inst.inventory.forEach(inventory => newInstance['quantity'] += inventory.count - inventory.reserved);
        instances.push(newInstance);
      });
      item['base_price'] = product.base_price;
      item['color'] = {
        '_id': color._id,
        'color_id': color.color_id,
        'name': color.name
      };
      item['count'] = 0;
      instance.inventory.forEach(inventory => item['count'] += inventory.count - inventory.reserved);
      item['discount'] = product.discount;
      item['discountedPrice'] = instance.discountedPrice;
      item['instance_id'] = p.instance_id;
      item['instance_price'] = instance.price;
      item['instances'] = instances;
      item['name'] = product.name;
      item['order_id'] = p.order_id;
      item['price'] = instance.price;
      item['product_id'] = p.product_id;
      item['quantity'] = p.quantity;
      item['size'] = instance.size || 'نامشخص';
      item['tags'] = product.tags;
      item['thumbnail'] = color.image.thumbnail;
      item['type'] = product.type;
      item['_id'] = p.instance_id;
      allProducts.push(item);
    });
    if (allProducts)
      this.checkoutService.setProductData(allProducts);
    if (allProducts.length > 0) {
      this.total = this.checkoutService.calculateTotal();
      this.discount = this.cartService.calculateDiscount(allProducts);
      this.finalCheckItems();
    }
  }

  async setPoints() {
    await this.checkoutService.getLoyaltyBalance()
      .then((res: any) => {
        this.balanceValue = res.balance;
        this.loyaltyPoint = res.loyaltyPointValue;
      })
      .catch(err => {
        console.error('Cannot get balance and loyalty points of customer: ', err);
      });

    if (!this.authService.userDetails.userId) {
      this.showEarnPointLabel = false;
      this.earnedLoyaltyPoint = 0;
    } else {
      this.showEarnPointLabel = true;
      this.checkoutService.loyaltyGroups.subscribe(data => this.loyaltyGroups = data);
      this.checkoutService.addPointArray.subscribe(data => {
        if (data && data[0])
          this.addPointArray = data[0].add_point;
      });
    }
  }

  ngOnDestroy() {
    this.cartItems$.unsubscribe();
  }

  async changePaymentType(data) {
    await this.setPoints();
    this.usedBalance = 0;
    this.usedLoyaltyPoint = 0;
    this.selectedPaymentType = data;

    switch (data) {
      case PaymentType.cash: {
        this.checkoutService.setPaymentType(data);
      }
        break;
      case PaymentType.balance: {
        if (this.balanceValue <= this.total) {
          this.usedBalance = this.balanceValue;
        } else {
          this.usedBalance = this.total;
        }
        // this.usedBalance = this.balanceValue;
        this.checkoutService.setPaymentType(data);
      }
        break;
      case PaymentType.loyaltyPoint: {
        this.usedLoyaltyPoint = this.loyaltyPoint * this.loyaltyValue;
        this.checkoutService.setPaymentType(data);
      }
        break;
    }
    this.calculateEarnPoint();
  }

  setCostLabel(data) {
    this.showCostLabel = data;
    this.calculateEarnPoint();
  }

  calculateEarnPoint() {
    try {
      let scoreArray;
      let maxScore;
      let customer_loyaltyGroup;
      let valid_loyaltyGroups;

      if (!this.authService.userDetails.userId) {
        this.earnedLoyaltyPoint = 0;
        this.showEarnPointLabel = false;
        return;
      }

      if (this.selectedPaymentType === PaymentType.loyaltyPoint)
        this.earnedLoyaltyPoint = 0;

      else if (this.showCostLabel) {
        // calculate earn point
        this.earnedLoyaltyPoint = Math.floor(this.total / this.system_offline_offer);
      } else {
        // calculate earn point in C&C mode
        valid_loyaltyGroups = this.loyaltyGroups.filter(el => el.min_score <= this.loyaltyPoint);

        if (!valid_loyaltyGroups.length) {
          scoreArray = this.loyaltyGroups.map(el => el.min_score);
          maxScore = Math.min(...scoreArray);
          customer_loyaltyGroup = this.loyaltyGroups.filter(el => el.min_score === maxScore);
        } else {
          scoreArray = valid_loyaltyGroups.map(el => el.min_score);
          maxScore = Math.max(...scoreArray);
          customer_loyaltyGroup = valid_loyaltyGroups.filter(el => el.min_score === maxScore);
        }
        try {
          this.earnedLoyaltyPoint = parseInt(this.addPointArray.filter(el => el.name === customer_loyaltyGroup[0].name)[0].added_point)
            + Math.floor(this.total / this.system_offline_offer);

        } catch (err) {
        }
      }
      this.checkoutService.setEarnSpentPoint(this.earnedLoyaltyPoint);
    } catch (e) {
      console.error('error in calculateEarnPoint: ', e);
    }
  }

  calculateDiscount(durationId) {
    if (this.total - this.discount >= FREE_DELIVERY_AMOUNT) {
      this.deliveryCost = 0;
      this.deliveryDiscount = 0;
      return;
    }
    if (durationId) {
      this.checkoutService.calculateDeliveryDiscount(durationId)
        .then((res: any) => {
          this.deliveryCost = res.delivery_cost;
          this.deliveryDiscount = res.delivery_discount;
        })
        .catch(err => {
          console.error('error occurred in getting delivery cost and discount', err);
        });
    }
  }

  finalCheckItems() {
    return new Promise((resolve, reject) => {
      try {
        this.checkoutService.finalCheck().subscribe(res => {
            this.soldOuts = res.filter(x => x.errors && x.errors.length && x.errors.includes('soldOut'));
            this.discountChanges = res.filter(x => x.warnings && x.warnings.length && x.warnings.includes('discountChanged'));
            this.priceChanges = res.filter(x => x.warnings && x.warnings.length && x.warnings.includes('priceChanged'));
            if ((this.soldOuts && this.soldOuts.length) ||
              (this.discountChanges && this.discountChanges.length) ||
              (this.priceChanges && this.priceChanges.length)) {
              this.changeMessage = '';

              if (!!this.soldOuts && !!this.soldOuts.length)
                this.changeMessage = 'متاسفانه برخی از محصولات به پایان رسیده‌اند';
              else if (this.discountChanges && this.discountChanges.length)
                this.changeMessage = 'برخی از تخفیف‌ها تغییر کرده‌است';
              else if (this.priceChanges && this.priceChanges.length)
                this.changeMessage = 'برخی از قیمت‌ها تغییر کرده‌است';

              this.productService.updateProducts(res);
              if (this.changeMessage) {
                this.dialog.open(CheckoutWarningConfirmComponent, {

                  position: {},
                  width: '400px',
                  data: {
                    isError: (!!this.soldOuts && !!this.soldOuts.length),
                    warning: this.changeMessage
                  }
                }).afterClosed().subscribe(x => {
                  if (x)
                    resolve();
                  else {
                    if (!!this.soldOuts && !!this.soldOuts.length)
                      this.router.navigate(['/', 'cart']);
                    reject({
                      errMsg: this.changeMessage,
                      errCode: 800,
                    });
                  }
                });
              } else {
                resolve();
              }
            } else
              resolve();
          },
          err => {
            console.error('error in finalCheckItems: ', err);
          });
      } catch (e) {
        console.error('error in finalCheck (maybe data isn\'t loaded yet?)');
      }
    });
  }

  checkout() {
    const orderData: any = this.checkoutService.accumulateData();
    const IdArray = [
      'invoiceNumber',
      'invoiceDate',
      'amount',
      'terminalCode',
      'merchantCode',
      'redirectAddress',
      'timeStamp',
      'action',
      'mobile',
      'email',
      'sign'
    ];

    this.finalCheckItems()
      .then(res => {
        console.log('*-*-*-', orderData);
        // first-step-1 :
        // get data object (containing sign key and other information like terminal and merchant code, amount, time stamp and ...)
        // from server to post and redirect to bank gateway page
        return this.checkoutService.getDataFromServerToSendBank(orderData);
      })
      .then(res => {
        console.log('////////', res);
        this.checkoutService.updateVariablesAfterCheckout();
        this.spinnerService.enable();
        this.bankData = res;
        IdArray.forEach(el => {
          this[el].nativeElement.value = this.bankData[el];
        });
        // this.bankDataFormId.nativeElement.submit(); // first-step-2 : post received data from server to bank gateway via form
      })
      .catch(err => {
        console.error('Error in final check: ', err);
        if (!err.errCode)
          this.snackBar.open('در حال حاضر امکان اتصال به درگاه پرداخت وجود ندارد، لطفا بعدا تلاش کنید', null, {
            duration: 3200,
          });
        this.spinnerService.disable();
      });
  }

  checkoutDemo() {
    // this.finalCheckItems()
    //   .then(res => {
    //     this.checkoutService.checkoutDemo();
    //   })
    //   .catch(err => {
    //     console.error('Error in final check: ', err);
    //   });


    const orderData: any = this.checkoutService.accumulateData();
    const IdArray = [
      'invoiceNumber',
      'invoiceDate',
      'amount',
      'terminalCode',
      'merchantCode',
      'redirectAddress',
      'timeStamp',
      'action',
      'mobile',
      'email',
      'sign'
    ];

    this.finalCheckItems()
      .then(res => {
        console.log('*-*-*-', orderData);
        // first-step-1 :
        // get data object (containing sign key and other information like terminal and merchant code, amount, time stamp and ...)
        // from server to post and redirect to bank gateway page
        return this.checkoutService.getDataFromServerToSendBank(orderData);
      })
      .then(res => {
        console.log('////////', res);
        this.checkoutService.updateVariablesAfterCheckout();
        this.spinnerService.enable();
        this.bankData = res;
        IdArray.forEach(el => {
          this[el].nativeElement.value = this.bankData[el];
        });
        // this.bankDataFormId.nativeElement.submit(); // first-step-2 : post received data from server to bank gateway via form
      })
      .catch(err => {
        console.error('Error in final check: ', err);
        if (!err.errCode)
          this.snackBar.open('در حال حاضر امکان اتصال به درگاه پرداخت وجود ندارد، لطفا بعدا تلاش کنید', null, {
            duration: 3200,
          });
        this.spinnerService.disable();
      });

  }
}

