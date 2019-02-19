import {Component, EventEmitter, Input, OnChanges, OnInit, Output, Inject} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {CartService} from '../../../../shared/services/cart.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {CheckoutService} from '../../../../shared/services/checkout.service';
import {WINDOW} from '../../../../shared/services/window.service';
import { GenDialogComponent } from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {MatDialog, MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnChanges {
  dialogEnum = DialogEnum;
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
  @Input() productsData;

  @Output() recalculateDiscount = new EventEmitter();
  private _total: any;
  private _discount: any = 0;
  used_coupon_code = '';
  discountValue: any = 0;
  totalValue: any = 0;
  balanceValue: any = 0;
  loyaltyPoint: any = 0;
  finalTotal: any = 0;
  coupon_code = '';
  show_coupon_area = false;
  isLoggedIn = false;

  constructor(@Inject(WINDOW) private window, public dialog: MatDialog, private cartService: CartService, private authService: AuthService,
    private router: Router, private checkoutService: CheckoutService, private snack: MatSnackBar) {
  }

  ngOnInit() {
    this.cartService.used_coupon_code$.subscribe(data => {
      this.used_coupon_code = data;
      this.coupon_code = data;
      if (this.used_coupon_code)
        this.recalculateDiscount.emit();
    });

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

    this.cartService.cartItems.subscribe(() => {
      if (this.productsData) {
        this.total = this.checkoutService.calculateTotal(this.productsData);
        this.discount = this.cartService.calculateDiscount(this.productsData);
      }
    });
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  changeCouponVisibility() {
    this.show_coupon_area = !this.show_coupon_area;
  }

  applyCoupon() {
    if (!this.isLoggedIn) {
      this.snack.open('برای استفاده از کوپن باید ثبت‌نام کنید و وارد شوید', null, {
          duration: 3000,
        });
      return;
    }
    if (this.used_coupon_code) {
      // false is a signal to let the cart component and service
      // know that they have to clear the used coupon code field
      this.recalculateDiscount.emit(false);
      return;
    }
    this.cartService.addCoupon(this.coupon_code)
      .then(res => {
        this.recalculateDiscount.emit(res);
      })
      .catch(err => {
        console.error('Error when validating coupon code: ', err);
      });
  }

  pay() {
    if (this.isLoggedIn) {
      this.cartService.applyCoupon(this.coupon_code)
        .then(res => {
          this.router.navigate(['/checkout']);
        })
        .catch(err => {
          console.error('Cannot apply coupon code: ', err);
        });
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  goToRegister() {
    if (this.window.innerWidth >= 960) {
      this.dialog.open(GenDialogComponent, {
        width: '500px',
        data: {
          componentName: this.dialogEnum.register,
        }
      });
    } else {
      this.router.navigate(['register']);
    }
  }
}
