import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {WINDOW} from '../../shared/services/window.service';
import {CartService} from '../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  products = [];
  numberOfProducts: String;
  totalPrice: any;
  discountValue: any;

  subs: any;

  constructor(@Inject(WINDOW) private window, private cartService: CartService) {
  }

  ngOnInit() {
    this.subs = this.cartService.cartItems.subscribe(data => {
      this.products = data;

      console.log(this.products);

      if (this.products.length > 0) {
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

  updateProduct(newValue, currentProduct) {
    console.log(newValue);
    console.log(currentProduct);
  }
}
