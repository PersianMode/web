import {Component, OnInit} from '@angular/core';
import {PaymentType} from '../../../shared/enum/payment.type.enum';
import {CheckoutService} from '../../../shared/services/checkout.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  total = 0;
  discount = 0;
  usedBalance = 0;
  usedLoyaltyPoint = 0;
  balanceValue = 0;
  loyaltyPoint = 0;
  paymentType = PaymentType;

  constructor(private checkoutService: CheckoutService) {
  }

  ngOnInit() {
    this.checkoutService.dataIsReady.subscribe(
      (data) => {
        if (data) {
          const totalDiscount = this.checkoutService.getTotalDiscount();
          this.total = totalDiscount.total;
          this.discount = totalDiscount.discount;
        }
      }
    );

    this.checkoutService.getLoyaltyBalance()
      .then((res: any) => {
        this.balanceValue = res.balance;
        this.loyaltyPoint = res.loyaltyPointValue;
      })
      .catch(err => {
        console.error('Cannot get balance and loyalty points of customer: ', err);
      });
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
}
