import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {EditOrderComponent} from '../edit-order/edit-order.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent implements OnInit {
  @Input() product = null;
  @Output() updateProduct = new EventEmitter();

  notExist = false;
  displaySize = null;
  displayQuantity = null;
  displayPrice = null;
  displayTotalPrice = null;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.notExist = !(this.product.count && this.product.quantity <= this.product.count);

    this.displaySize = this.product.size.toLocaleString('fa');
    this.displayQuantity = this.product.quantity.toLocaleString('fa');
    this.displayPrice = '@ ' + priceFormatter(this.product.price) + ' تومان';
    this.displayTotalPrice = priceFormatter(this.product.quantity * this.product.price) + ' تومان';
  }

  deleteProduct() {
    this.updateProduct.emit({type: 'delete'});
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
        if (data) {
          this.updateProduct.emit({type: 'update', value: data});
          this.displaySize = (data.newSize ? data.newSize : this.product.size).toLocaleString('fa');
          this.displayQuantity = (data.newQuantity ? data.newQuantity : this.product.quantity).toLocaleString('fa');
          this.displayPrice = '@ ' + priceFormatter(this.product.price) + ' تومان';
          this.displayTotalPrice = priceFormatter((data.newQuantity ? data.newQuantity : this.product.quantity) * this.product.price)  + ' تومان';
        }
      },
      (err) => {
        console.error('Error in dialog: ', err);
      }
    );
  }
}
