import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {WINDOW} from '../../shared/services/window.service';
import {CartService} from '../../shared/services/cart.service';
import {AuthService} from '../../shared/services/auth.service';
import {priceFormatter} from '../../shared/lib/priceFormatter';

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

  subs: any;
  isLoggedIn = false;

  constructor(@Inject(WINDOW) private window, private cartService: CartService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data) => this.isLoggedIn = data
    );

    this.subs = this.cartService.cartItems.subscribe(data => {
      this.products = data;

      if (this.products.length > 0) {
        this.numberOfProducts = priceFormatter(this.products.map(el => el.quantity).reduce((a, b) => a + b));

        this.totalPrice = this.products
          .filter(el => el.count && el.quantity <= el.count)
          .map(el => el.price * el.quantity)
          .reduce((a, b) => a + b);
        this.discountValue = this.products.map(el => el.discount).reduce((a, b) => a + b);
      }
    });
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

      }
      break;
    }
  }
}
