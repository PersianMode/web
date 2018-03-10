import {Component, Input, OnInit} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent implements OnInit {
  @Input() private product = null;
  total_price = null;
  constructor() {
  }

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
