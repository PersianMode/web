import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {CartService} from '../../../../shared/services/cart.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../shared/services/auth.service';
import {DictionaryService} from '../../../../shared/services/dictionary.service';

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

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<AddToCardConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private cartService: CartService,
              private router: Router, private auth: AuthService, private dict: DictionaryService) { }
  ngOnInit() {
    this.cartNumbers = 0;
    this.name = (this.data && this.data.name) ? this.data.name : null;
    this.product = this.data.product;
    this.auth.isLoggedIn.subscribe(() => {
      const isEU = this.auth.userDetails.shoesType === 'EU';
      if (isEU) {
        const gender = this.product.tags.find(tag => tag.tg_name.toUpperCase() === 'GENDER').name;
        this.selectedSize = this.dict.USToEU(this.data.selectedSize, gender,this.data.product.product_type.name || this.data.product.type);
      } else {
        this.selectedSize = this.dict.translateWord(this.data.selectedSize);
      }
    });
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

  navigateToCart() {
    this.router.navigate(['/', 'cart']);
    this.dialogRef.close();
  }
}
