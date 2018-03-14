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

  subs: any;

  constructor(@Inject(WINDOW) private window, private cartService: CartService) {
  }

  ngOnInit() {
    this.subs = this.cartService.cartItems.subscribe(data => {
      this.products = data;
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
