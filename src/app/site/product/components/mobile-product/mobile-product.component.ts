import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartService} from '../../../../shared/services/cart.service';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {HttpService} from 'app/shared/services/http.service';

@Component({
  selector: 'app-mobile-product',
  templateUrl: './mobile-product.component.html',
  styleUrls: ['./mobile-product.component.css']
})
export class MobileProductComponent implements OnInit {
  @Input() product;
  @Input() price;
  @Input() discountedPrice;
  @Input() discounted;
  @Input() sub;
  @Input() id;
  @Input() gender;
  @Input() productType;
  @Input() color;
  @Input() barcode;

  @Input()
  set selectedProductColorID(id) {
    if (id && this.product.colors) {
      this.selectedProductColor = this.product.colors.find(r => r._id === id);
      this.productSize = this.product.sizesByColor[id];
    }
  };

  productSize = [];
  selectedProductColor: any = {};
  addCardBtnDisabled = false;
  @Output() add = new EventEmitter<any>();
  @Output() addFavorite = new EventEmitter<any>();
  @Output() changeSize = new EventEmitter<any>();
  size = '';
  chosen = false;
  config = {scrollbar: true}

  constructor(private cartService: CartService, private router: Router,
    private snackBar: MatSnackBar) {
  }

  newSize(event) {
    this.size = event;
    this.addCardBtnDisabled = !this.size;
    this.changeSize.emit(this.size);
  }

  ngOnInit() {
    this.cartService.itemAdded$.subscribe(r => this.addCardBtnDisabled = !r);
  }

  saveToCart() {
    this.chosen = true;
    console.log(this.size);
    this.add.emit(this.size);
  }

  saveToFavorites() {
    this.addFavorite.emit(this.size);
  }

  getProductShareLink() {
    return HttpService.Host + this.router.url;
  }

  copyLinkToClipboard() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.getProductShareLink();
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.snackBar.open('لینک محصول در پس زمینه کپی شد', null, {
      duration: 2000,
    });
  }
}
