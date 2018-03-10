import {Component, Input, OnInit} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {EditOrderComponent} from '../edit-order/edit-order.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent implements OnInit {
  @Input() private product = null;

  total_price = null;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.product.size = {value: this.product.size, name: this.product.size.toLocaleString('fa')};
    this.product.quantity = {value: this.product.quantity, name: this.product.quantity.toLocaleString('fa')};
    this.product.price = {value: this.product.price, name: priceFormatter(this.product.price)};
    this.total_price = this.product.quantity.value * this.product.price.value;
    this.total_price = {value: this.total_price, name: priceFormatter(this.total_price)};
  }
  deleteProduct() {
  }
  openEditOrder() {
    const rmDialog = this.dialog.open(EditOrderComponent, {
      width: '850px',
      data: {
        dialog_product: this.product,
      }
    });
    rmDialog.afterClosed().subscribe(
      (data) => {
        this.product.size = {value: data.newSize, name: data.newSize.toLocaleString('fa')};
        this.product.quantity = {value: data.newQuantity, name: data.newQuantity.toLocaleString('fa')};
        this.product.price = {value: this.product.price.value, name: priceFormatter(this.product.price.value)};
        this.total_price = this.product.quantity.value * this.product.price.value;
        this.total_price = {value: this.total_price, name: priceFormatter(this.total_price)};
        if (data) {
        }
      },
      (err) => {
        console.error('Error in dialog: ', err);
      }
    );
  }
}
