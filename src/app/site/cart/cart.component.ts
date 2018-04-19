import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {WINDOW} from '../../shared/services/window.service';
import {CartService} from '../../shared/services/cart.service';
import {AuthService} from '../../shared/services/auth.service';
import {priceFormatter} from '../../shared/lib/priceFormatter';
import {GenDialogComponent} from '../../shared/components/gen-dialog/gen-dialog.component';
import {Router} from '@angular/router';
import {DialogEnum} from '../../shared/enum/dialog.components.enum';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  products = [];
  numberOfProducts: any;
  totalPrice: any;
  discountValue: any;
  dialogEnum = DialogEnum;
  subs: any;
  isLoggedIn = false;
  valid = [];
  disabled = false;

  constructor(@Inject(WINDOW) private window, private cartService: CartService,
              private authService: AuthService, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data) => this.isLoggedIn = data
    );

    this.subs = this.cartService.cartItems.subscribe(data => {
      this.products = data;
      data.forEach(() => this.valid.push(true));

      if (this.products.length > 0) {
        this.numberOfProducts = priceFormatter(this.products.map(el => el.quantity).reduce((a, b) => a + b));

        // this.totalPrice = this.products
        //   .filter(el => el.count && el.quantity <= el.count)
        //   .map(el => el.price * el.quantity)
        //   .reduce((a, b) => a + b);
        this.totalPrice = this.cartService.calculateTotal();
        this.calculateDiscount();
      } else {
        this.router.navigate(['/']);
      }
    });
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  updateProduct(data, currentProduct) {
    switch (data.type) {
      case 'delete': {
        this.cartService.removeItem({instance_id: currentProduct.instance_id, product_id: currentProduct.product_id});
      }
        break;
      case 'update': {
        if (!data.value.newQuantity)
          return;

        const tempInstance = currentProduct.instances.find(el => el.size === data.value.newSize);

        this.cartService.updateItem({
          pre_instance_id: currentProduct.instance_id,
          instance_id: tempInstance ? tempInstance.instance_id : currentProduct.instance_id,
          product_id: currentProduct.product_id,
          number: data.value.newQuantity,
        });
      }
        break;
    }
  }

  calculateDiscount(considerCoupon = false) {
    this.discountValue = this.cartService.calculateDiscount(considerCoupon);
  }

  changeValidation(isValid, i) {
    this.valid[i] = isValid;
    this.disabled = !this.valid.reduce((x, y) => x && y, true);
  }
}
