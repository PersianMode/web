import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../shared/services/window.service';
import {priceFormatter} from '../../shared/lib/priceFormatter';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  products = [
    {
      product_id: 0,
      instance_id: 14,
      name: 'کایری ۳ مدل What The',
      tags: ['کفش', 'بسکتبال', 'نوجوانان'],
      price: 599000,
      size: 6.5,
      quantity: 3,
      color: {
        color_id: 101,
        name: 'طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی'
      },
      thumbnail: '11.jpeg',
      discount: '',
      instances: [{
        instance_id: 14,
        size: 6.5,
        quantity: [7],
        discount: ''
      }, {
        instance_id: 15,
        size: 7,
        quantity: [5],
        discount: ''
      }, {
        instance_id: 16,
        size: 8,
        quantity: [7],
        discount: ''
      }]
    },
    {
      product_id: 0,
      instance_id: 12,
      name: 'mock data 2',
      tags: ['کفش', 'فوتبال', 'جوانان'],
      price: 285000,
      size: 9.5,
      quantity: 7,
      color: {
        color_id: 101,
        name: 'طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی'
      },
      thumbnail: '11.jpeg',
      discount: '',
      instances: [{
        instance_id: 14,
        size: 9.5,
        quantity: [7],
        discount: ''
      },
        {
        instance_id: 15,
        size: 7.5,
        quantity: [5],
        discount: ''
      },
      {
        instance_id: 16,
        size: 16,
        quantity: [7],
        discount: ''
      },      {
          instance_id: 16,
          size: 19,
          quantity: [3],
          discount: ''
        }]
    }];
  numberOfProducts: String;
  constructor(@Inject(WINDOW) private window) {
  }

  ngOnInit() {
    this.numberOfProducts = priceFormatter(this.products.length);
  }
}
