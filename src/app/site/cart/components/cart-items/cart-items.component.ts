import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {EditOrderComponent} from '../edit-order/edit-order.component';
import {MatDialog} from '@angular/material';
import {DictionaryService} from '../../../../shared/services/dictionary.service';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent implements OnInit {
  @Input() product = null;

  @Output() updateProduct = new EventEmitter();
  @Output() valid = new EventEmitter();

  notExist = false;
  stock = 0;
  displaySize = null;
  displayQuantity = null;
  displayPrice = null;
  displayTotalPrice = null;

  constructor(private dialog: MatDialog, private dict: DictionaryService) {
  }

  ngOnInit() {
    this.notExist = !(this.product.count && this.product.quantity <= this.product.count);
    this.stock = this.product.count.toLocaleString('fa', {useGrouping: false});
    this.valid.emit(!this.notExist);
    this.displaySize = this.dict.translateWord(this.product.size);
    this.displayQuantity = this.dict.translateWord(this.product.quantity);
    this.displayPrice = '@ ' + priceFormatter(this.product.price) + ' تومان';
    this.displayTotalPrice = priceFormatter(this.product.quantity * this.product.price) + ' تومان';
  }

  deleteProduct() {
    this.updateProduct.emit({type: 'delete'});
  }

  openEditOrder() {
    const rmDialog = this.dialog.open(EditOrderComponent, {
      width: '600px',
      data: {
        dialog_product: this.product,
      }
    });
    rmDialog.afterClosed().subscribe(
      (data) => {
        if (data) {
          this.updateProduct.emit({type: 'update', value: data});
        }
      },
      (err) => {
        console.error('Error in dialog: ', err);
      }
    );
  }
}
