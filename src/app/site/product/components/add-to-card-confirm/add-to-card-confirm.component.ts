import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {CartService} from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-add-to-card-confirm',
  templateUrl: './add-to-card-confirm.component.html',
  styleUrls: ['./add-to-card-confirm.component.css']
})
export class AddToCardConfirmComponent implements OnInit {
  name = null;
  product: any;
  cartNumbers = null;
  selectedSize = null;
  farsiPrice = null;
  thumbnail;
  countFa;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<AddToCardConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private cartService: CartService) { }
  ngOnInit() {
    this.cartNumbers = 0;
    this.name = (this.data && this.data.name) ? this.data.name : null;
    this.product = this.data.product;
    this.selectedSize = this.data.selectedSize;
    this.farsiPrice = '@ ' + priceFormatter(this.data.instance.price ? this.data.instance.price : this.product.base_price) + ' تومان';
    this.thumbnail = this.product.colors.find(r => this.data.instance.product_color_id === r._id).image.thumbnail;
    this.cartService.cartItems.subscribe(items => {
      const found = items.find(r => r.instance_id === this.data.instance._id && r.product_id === this.data.product.id);
      if (found) {
        this.countFa = found.quantity.toLocaleString('fa', {useGrouping: false}) + ' عدد ';
      }
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
