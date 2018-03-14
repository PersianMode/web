import {Component, Input, OnInit} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {CartService} from '../../../../shared/services/cart.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {isNullOrUndefined} from 'util';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input()
  set total(value) {
    this._total = value;
    if (value) {
      this.totalValue = value ? priceFormatter(value) : null;
      this.finalTotal = value ? priceFormatter(value - this.discount) : null;
    }
  }

  get total() {
    return this._total;
  }

  @Input()
  set discount(value) {
    this._discount = value;
    if (!value)
      value = 0;

    this.discountValue = priceFormatter(value);
    this.finalTotal = this.total ? priceFormatter(this.total - value) : null;
  }

  get discount() {
    return this._discount;
  }

  private _total: any;
  private _discount: any = 0;
  discountValue: any = 0;
  totalValue: any = 0;
  balanceValue: any = 0;
  loyaltyPoint: any = 0;
  finalTotal: any = 0;

  constructor(private cartService: CartService, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data) => {
        if (data)
          this.cartService.getLoyaltyBalance()
            .then((res: any) => {
              this.balanceValue = priceFormatter(res.balance);
              this.loyaltyPoint = priceFormatter(res.loyalty_points);
            })
            .catch(err => {
              console.error('Cannot get user balance and loyalty: ', err);
            });
      });
  }

}
