import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

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
  count = 1;
  thumbnail;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<AddToCardConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    this.cartNumbers = 0;
    this.name = (this.data && this.data.name) ? this.data.name : null;
    this.product = this.data.dialog_product;
    this.cartNumbers = this.data.cartNumbers;
    this.selectedSize = this.data.selectedSize;
    this.farsiPrice = priceFormatter(this.product.price);
    this.thumbnail = this.product.colors.find(r => this.data.instance.product_color_id === r._id).image.thumbnail;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
