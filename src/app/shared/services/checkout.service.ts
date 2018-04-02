import {Injectable} from '@angular/core';
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

  constructor(private cartService: CartService) {
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
}
