import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {WINDOW} from '../../shared/services/window.service';
import {priceFormatter} from '../../shared/lib/priceFormatter';
import {CartService} from '../../shared/services/cart.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  // products = [
  //   {
  //     product_id: 0,
  //     instance_id: 14,
  //     name: 'کایری ۳ مدل What The',
  //     tags: ['کفش', 'بسکتبال', 'نوجوانان'],
  //     price: 599000,
  //     size: 6.5,
  //     quantity: 3,
  //     color: {
  //       color_id: 101,
  //       name: 'طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی'
  //     },
  //     thumbnail: '11.jpeg',
  //     discount: '',
  //     instances: [{
  //       instance_id: 14,
  //       size: 6.5,
  //       quantity: [7],
  //       discount: ''
  //     }, {
  //       instance_id: 15,
  //       size: 7,
  //       quantity: [5],
  //       discount: ''
  //     }, {
  //       instance_id: 16,
  //       size: 8,
  //       quantity: [7],
  //       discount: ''
  //     }]
  //   },
  //   {
  //     product_id: 0,
  //     instance_id: 12,
  //     name: 'mock data 2',
  //     tags: ['کفش', 'بسکتبال', 'نوجوانان'],
  //     price: 599000,
  //     size: 6.5,
  //     quantity: 3,
  //     color: {
  //       color_id: 101,
  //       name: 'طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی'
  //     },
  //     thumbnail: '11.jpeg',
  //     discount: '',
  //     instances: [{
  //       instance_id: 14,
  //       size: 6.5,
  //       quantity: [7],
  //       discount: ''
  //     }, {
  //       instance_id: 15,
  //       size: 7,
  //       quantity: [5],
  //       discount: ''
  //     }, {
  //       instance_id: 16,
  //       size: 8,
  //       quantity: [7],
  //       discount: ''
  //     }]
  //   }];
  products = [];
  numberOfProducts: String;
  subs: any;
  constructor(@Inject(WINDOW) private window, private cartService: CartService, private authService: AuthService) {
  }

  ngOnInit() {
    //cart service should deliver a data in format like above comment out products data
    //the item of array products are all datas that customer have selected and put in his/her bascket
    // (this component dot nedd to have angle pictures of every product, but we horriblynedd to have productId,
    // and instanceId and colorId or colorName and have exist sizes of a special color of a productId)
    if (!this.authService.isLoggedIn.getValue())
       this.subs = this.cartService.cartItems.subscribe(data => {
          this.products = data;
        }
      )
    this.numberOfProducts = priceFormatter(this.products.length);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
