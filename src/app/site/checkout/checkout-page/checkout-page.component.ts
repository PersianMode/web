import {Component, OnInit} from '@angular/core';
import {PaymentType} from '../../../shared/enum/payment.type.enum';
import {CheckoutService} from '../../../shared/services/checkout.service';
import {HttpService} from '../../../shared/services/http.service';
import {CartService} from '../../../shared/services/cart.service';
import {TitleService} from '../../../shared/services/title.service';
import {ProductService} from '../../../shared/services/product.service';
import {MatDialog} from '@angular/material';
import {CheckoutWarningConfirmComponent} from '../checkout-warning-confirm/checkout-warning-confirm.component';
import {Router} from '@angular/router';


@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  total = 0;
  discount = 0;
  deliveryDiscount;
  deliveryCost;
  usedBalance = 0;
  usedLoyaltyPoint = 0;
  balanceValue = 0;
  loyaltyPoint = 0;
  paymentType = PaymentType;
  disabled: boolean = false;
  changeMessage: string = '';
  soldOuts: any[];
  discountChanges: any[];
  priceChanges: any[];
  showCostLabel: true;
  noDuration = null;
  hasChangeError: boolean = false;

  constructor(private checkoutService: CheckoutService,
              private dialog: MatDialog,
              private httpService: HttpService,
              private cartService: CartService,
              private titleService: TitleService,
              private router: Router,
              private productService: ProductService) {
  }

  ngOnInit() {
    this.titleService.setTitleWithConstant('پرداخت هزینه');
    this.checkoutService.dataIsReady.subscribe(
      (data) => {
        if (data) {
          const totalDiscount = this.checkoutService.getTotalDiscount();
          this.total = totalDiscount.total;
          this.discount = totalDiscount.discount;
        }
      }
    );
    this.finalCheckItems();

    this.checkoutService.getLoyaltyBalance()
      .then((res: any) => {
        this.balanceValue = res.balance;
        this.loyaltyPoint = res.loyaltyPointValue;
      })
      .catch(err => {
        console.error('Cannot get balance and loyalty points of customer: ', err);
      });

    this.checkoutService.isValid$.subscribe(r => this.disabled = (!r && !this.soldOuts));
  }

  changePaymentType(data) {
    this.usedBalance = 0;
    this.usedLoyaltyPoint = 0;

    switch (data) {
      case this.paymentType.balance: {
        this.usedBalance = this.balanceValue;
        this.checkoutService.setPaymentType(data);
      }
        break;
      case this.paymentType.loyaltyPoint: {
        this.usedLoyaltyPoint = this.loyaltyPoint;
        this.checkoutService.setPaymentType(data);
      }
        break;
    }
  }

  showDiscountLabel(data) {
    this.showCostLabel = data;
  }

  calculateDiscount(durationId) {
    if (durationId) {
      this.checkoutService.calculateDeliveryDiscount(durationId)
        .then((res: any) => {
          this.deliveryCost = res.res_delivery_cost;
          this.deliveryDiscount = res.res_delivery_discount;
        })
        .catch(err => {
          console.error('error occured in getting delivery cost and discount', err);
        });
    }
  }

  finalCheckItems() {
    return new Promise((resolve, reject) => {
      this.checkoutService.finalCheck().subscribe(res => {
          console.log(res);
          this.soldOuts = res.filter(x => x.errors && x.errors.length && x.errors.includes('soldOut'));
          this.discountChanges = res.filter(x => x.warnings && x.warnings.length && x.warnings.includes('discountChanged'));
          this.priceChanges = res.filter(x => x.warnings && x.warnings.length && x.warnings.includes('priceChanged'));
          if ((this.soldOuts && this.soldOuts.length) ||
            (this.discountChanges && this.discountChanges.length) ||
            (this.priceChanges && this.priceChanges.length)) {
            this.changeMessage = '';

            if (!!this.soldOuts && !!this.soldOuts.length)
              this.changeMessage = 'متاسفانه برخی از محصولات به پایان رسیده اند';
            else if (this.discountChanges && this.discountChanges.length)
              this.changeMessage = 'برخی از تخفیف ها تغییر کرده است';
            else if (this.priceChanges && this.priceChanges.length)
              this.changeMessage = 'برخی از قیمت ها تغییر کرده است';

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
                  reject();
                }
              });
            }
            else {
              resolve();
            }
          }
        },
        err => {
          reject();
        });
    });
  }

  checkout() {
    this.finalCheckItems()
      .then(res => {
        this.checkoutService.checkout();
      })
      .catch(err => {

      });
  }
}
