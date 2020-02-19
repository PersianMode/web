import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PaymentType } from '../../../shared/enum/payment.type.enum';
import { CheckoutService } from '../../../shared/services/checkout.service';
import { HttpService } from '../../../shared/services/http.service';
import { CartService } from '../../../shared/services/cart.service';
import { TitleService } from '../../../shared/services/title.service';
import { ProductService } from '../../../shared/services/product.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CheckoutWarningConfirmComponent } from '../checkout-warning-confirm/checkout-warning-confirm.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { DOCUMENT, Location } from '@angular/common';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { FREE_DELIVERY_AMOUNT } from 'app/shared/enum/delivery.enum';
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
  balanceValue = 0;
  loyaltyPoint = 0;
  maxLoyaltyDiscount = 0;
  disabled = false;
  changeMessage = '';
  soldOuts: any[] = [];
  discountChanges: any[];
  priceChanges: any[];
  noDuration = null;
  loyaltyGroups = [];
  addPointArray = [];
  selectedPaymentType = PaymentType.cash;
  loyaltyValue = 700;  // system_offline offers this
  bankData: any = null;
  isDev: boolean = true;

  useBalance: boolean = false;

  cartItems$;
  products;

  finalTotal = 0;

  constructor(private checkoutService: CheckoutService,
    private httpService: HttpService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cartService: CartService,
    private titleService: TitleService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private router: Router,
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

    this.authService.isLoggedIn.subscribe(res => {
      this.setPoints();
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
      const instance = product.instances.find(i => i._id === p.instance_id) || { inventory: [] };
      const color = product.colors.find(c => c._id === instance.product_color_id) || { image: {} };
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

    try {
      this.spinnerService.enable();
      const res: any = await this.checkoutService.getLoyaltyBalance()
      this.balanceValue = res.balance;
      this.loyaltyPoint = res.loyaltyPoint;

      if (!this.authService.userDetails.userId) {
      } else {
        this.checkoutService.loyaltyGroups.subscribe(data => this.loyaltyGroups = data);
        this.checkoutService.addPointArray.subscribe(data => {
          if (data && data[0])
            this.addPointArray = data[0].add_point;
        });
      }
    } catch (error) {
      console.log(' -> ', error);
    } finally {
      this.spinnerService.disable();
    }

  }

  ngOnDestroy() {
    this.cartItems$.unsubscribe();
  }

  async changePaymentType(data) {
    await this.setPoints();
    this.maxLoyaltyDiscount = 0;
    this.selectedPaymentType = data;

    this.useBalance = false;
    switch (data) {
      case PaymentType.cash: {
        this.checkoutService.setPaymentType(data);
      }
        break;
      case PaymentType.balance: {
        this.checkoutService.setPaymentType(data);
        this.useBalance = true;
      }
        break;
    }
  }

  onLoyaltyUseChange(useLoyalyty: boolean) {
    this.checkoutService.useLoyalty = useLoyalyty;
    this.maxLoyaltyDiscount = useLoyalyty ? this.loyaltyPoint * this.loyaltyValue : 0
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

  async checkout() {

    try {

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

      await this.finalCheckItems();
      // first-step-1 :
      // get data object (containing sign key and other information like terminal and merchant code, amount, time stamp and ...)
      // from server to post and redirect to bank gateway page
      const res = await this.checkoutService.getDataFromServerToSendBank(orderData);
      this.checkoutService.updateVariablesAfterCheckout();
      this.spinnerService.enable();
      this.bankData = res;
      IdArray.forEach(el => {
        this[el].nativeElement.value = this.bankData[el];
      });
      this.bankDataFormId.nativeElement.submit(); // first-step-2 : post received data from server to bank gateway via form
    } catch (error) {
      console.error('Error in final check: ', error);
      if (!error.errCode)
        this.snackBar.open('در حال حاضر امکان اتصال به درگاه پرداخت وجود ندارد، لطفا بعدا تلاش کنید', null, {
          duration: 3200,
        });
    }
    this.spinnerService.disable();
  }

  async completeShop() {
    try {

      this.spinnerService.enable();
      await this.finalCheckItems();
      await this.checkoutService.completeShop();
    } catch (error) {
      console.error(' -> ', error);
    }
    this.spinnerService.disable();
  }

  totalChanged($event) {
    this.finalTotal = $event;
  }
}

