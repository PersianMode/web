import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-checkout-warning-confirm',
  templateUrl: './checkout-warning-confirm.component.html',
  styleUrls: ['./checkout-warning-confirm.component.css']
})
export class CheckoutWarningConfirmComponent implements OnInit {

  name = null;
  product: any;
  cartNumbers = null;
  selectedSize = null;
  farsiPrice = null;
  discountedPrice = null;
  thumbnail;
  countFa;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<CheckoutWarningConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
  }

  ngOnInit() {
    console.log(this.data);
    // this.cartNumbers = 0;
    // this.name = (this.data && this.data.name) ? this.data.name : null;
    // this.product = this.data.product;
    // const gender = this.product.tags.find(tag => tag.tg_name.toUpperCase() === 'GENDER').name;
    // const price = this.data.instance.price ? this.data.instance.price : this.product.base_price;
    // this.thumbnail = this.product.colors.find(r => this.data.instance.product_color_id === r._id).image.thumbnail;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  navigateToCart() {
    this.router.navigate(['/', 'cart']);
    this.dialogRef.close();
  }
}

