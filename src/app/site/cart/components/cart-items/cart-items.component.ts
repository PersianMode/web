import { Component, OnInit } from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent implements OnInit {
  product: any = {
    instance_id: 14,
    name: 'کایری ۳ مدل What The',
    tags: ['کفش', 'بسکتبال', 'نوجوانان'],
    price: 599000,
    size: 6.5,
    quantity : 3,
    color : {
      color_id : 101,
      name: 'طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی'
    },
    thumbnail : '11.jpeg',
    discount : '',
    instances : [{
      instance_id : 14,
      size : 6.5,
      existQuantity : [7],
      discount : ''
    },{
      instance_id : 15,
      size : 7,
      existQuantity : [5],
      discount : ''
    }, {
      instance_id : 16,
      size : 8,
      existQuantity : [7],
      discount : ''
    }]
  };
  
  total_price = null;
  constructor() { }

  ngOnInit() {
    this.total_price = this.product.quantity * this.product.price;
    this.total_price = priceFormatter(this.total_price);
    this.product.price = priceFormatter(this.product.price);
    this.product.size = this.product.size.toLocaleString('fa');
    this.product.quantity = this.product.quantity.toLocaleString('fa');
  }
  deleteProduct() {
  }
  editOrder() {
  }
}
