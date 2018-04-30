import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {CartService} from '../../../../shared/services/cart.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input()
  set total(value) {
    this._total = value;
    if (value || value === 0) {
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
  @Input() disabled;
  @Output() recalculateDiscount = new EventEmitter();
  private _total: any;
  private _discount: any = 0;
  discountValue: any = 0;
  totalValue: any = 0;
  balanceValue: any = 0;
  loyaltyPoint: any = 0;
  finalTotal: any = 0;
  coupon_code = '';
  show_coupon_area = false;
  isLoggedIn = false;

  constructor(private cartService: CartService, private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data) => this.isLoggedIn = this.authService.userIsLoggedIn(),
      (err) => {
        console.error('Cannot subscribe to isLoggedIn in authService: ', err);
      }
    );

    this.cartService.getLoyaltyBalance()
      .then((res: any) => {
        this.balanceValue = priceFormatter(res.balance);
        this.loyaltyPoint = priceFormatter(res.loyalty_points);
      })
      .catch(err => {
        console.error('Cannot get user balance and loyalty: ', err);
      });
  }

  changeCouponVisibility() {
    this.show_coupon_area = !this.show_coupon_area;
  }

  applyCoupon() {
    this.cartService.addCoupon(this.coupon_code)
      .then(res => {
        this.recalculateDiscount.emit(res);
      })
      .catch(err => {
        console.error('Error when validating coupon code: ', err);
      });
  }

  pay() {
    this.cartService.applyCoupon(this.coupon_code)
      .then(res => {
        this.router.navigate(['/checkout']);
      })
      .catch(err => {
        console.error('Cannot apply coupon code: ', err);
      });
  }
}
