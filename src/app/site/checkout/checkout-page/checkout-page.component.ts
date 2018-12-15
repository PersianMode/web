import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {PaymentType} from '../../../shared/enum/payment.type.enum';
import {CheckoutService} from '../../../shared/services/checkout.service';
import {HttpService} from '../../../shared/services/http.service';
import {CartService} from '../../../shared/services/cart.service';
import {TitleService} from '../../../shared/services/title.service';
import {ProductService} from '../../../shared/services/product.service';
import {MatDialog} from '@angular/material';
import {CheckoutWarningConfirmComponent} from '../checkout-warning-confirm/checkout-warning-confirm.component';
import {ActivatedRoute, Router} from '@angular/router';

import {ProgressService} from '../../../shared/services/progress.service';
import {AuthService} from '../../../shared/services/auth.service';
import {DOCUMENT, Location} from '@angular/common';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  @ViewChild('bankDataId', {read: ElementRef}) bankDataId: ElementRef;
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
  soldOuts: any[] = [];
  discountChanges: any[];
  priceChanges: any[];
  showCostLabel: true;
  noDuration = null;
  loyaltyGroups = [];
  addPointArray = [];
  selectedPaymentType = 0;
  earnedLoyaltyPoint = 0;
  system_offline_offer = 25000;
  loyaltyValue = 400;  // system_offline offers this
  showEarnPointLabel = true;
  bankData: any = null;
  bankDataForm: FormGroup = null;

  constructor(private checkoutService: CheckoutService,
              private httpService: HttpService,
              private authService: AuthService,
              private dialog: MatDialog,
              private cartService: CartService,
              private titleService: TitleService,
              private progressService: ProgressService,
              private router: Router, @Inject(DOCUMENT) private document: any, private location: Location,
              private productService: ProductService, private route: ActivatedRoute, private http: HttpClient) {
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

    this.checkoutService.isValid$.subscribe(r => {
      this.disabled = !(r && (this.soldOuts || !this.soldOuts.length));
    });
    if (!this.authService.userDetails.userId) {
      this.showEarnPointLabel = false;
      this.earnedLoyaltyPoint = 0;
    } else {
      this.showEarnPointLabel = true;
      this.checkoutService.loyaltyGroups.subscribe(data => this.loyaltyGroups = data);
      this.checkoutService.addPointArray.subscribe(data => this.addPointArray = data[0].add_point);
    }

    // this.checkoutService.setPaymentType(this.paymentType.cash);
    this.checkoutService.setPaymentType(this.paymentType[this.selectedPaymentType]);
  }

  changePaymentType(data) {
    this.usedBalance = 0;
    this.usedLoyaltyPoint = 0;
    this.selectedPaymentType = data;

    switch (data) {
      case this.paymentType.cash: {
        this.checkoutService.setPaymentType(data);
      }
        break;
      case this.paymentType.balance: {
        this.usedBalance = this.balanceValue;
        this.checkoutService.setPaymentType(data);
      }
        break;
      case this.paymentType.loyaltyPoint: {
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
    let scoreArray;
    let maxScore;
    let customer_loyaltyGroup;
    let valid_loyaltyGroups;

    if (!this.authService.userDetails.userId) {
      this.earnedLoyaltyPoint = 0;
      this.showEarnPointLabel = false;
      return;
    }

    if (this.selectedPaymentType === 2)
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
      this.earnedLoyaltyPoint = parseInt(this.addPointArray.filter(el => el.name === customer_loyaltyGroup[0].name)[0].added_point)
        + Math.floor(this.total / this.system_offline_offer);
    }
    this.checkoutService.setEarnSpentPoint(this.earnedLoyaltyPoint);
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
            } else {
              resolve();
            }
          } else
            resolve();
        },
        err => {
          reject();
        });
    });
  }

  checkout() {
    this.finalCheckItems()
      .then(res => {   // redirect to bank payment page
        return this.checkoutService.sendDataToBank();
      })
      .then((res) => {
        this.bankData = res;
        this.bankDataId.nativeElement.submit();

      })
      .then(res => {
        // this.checkoutService.checkout();
      })
      .catch(err => {
        console.error('Error in final check: ', err);
      });
  }
}

