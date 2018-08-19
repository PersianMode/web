import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {EditOrderComponent} from '../edit-order/edit-order.component';
import {MatDialog} from '@angular/material';
import {DictionaryService} from '../../../../shared/services/dictionary.service';
import {AuthService} from '../../../../shared/services/auth.service';

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
  totalDiscountedPrice = null;
  discountedPrice = null;
  color = '';

  constructor(private dialog: MatDialog, private dict: DictionaryService, private auth: AuthService) {
  }

  ngOnInit() {
    this.notExist = !(this.product.count && this.product.quantity <= this.product.count);
    this.stock = this.product.count.toLocaleString('fa', {useGrouping: false});
    this.valid.emit(!this.notExist);

    this.displayQuantity = this.dict.translateWord(this.product.quantity);
    this.displayPrice = '@ ' + priceFormatter(this.product.price) + ' تومان';
    this.discountedPrice = '@ ' + priceFormatter(this.product.discountedPrice) + ' تومان';
    this.displayTotalPrice = priceFormatter(this.product.quantity * this.product.price) + ' تومان';
    this.totalDiscountedPrice = priceFormatter(this.product.quantity * this.product.discountedPrice) + ' تومان';
    this.color =  this.dict.translateColor(this.product.color);

    this.auth.isLoggedIn.subscribe(() => {
      const gender = this.product.tags.find(tag => tag.tg_name.toUpperCase() === 'GENDER').name;
      this.displaySize = this.dict.setShoesSize(this.product.size, gender, this.product.productType);
    });
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
