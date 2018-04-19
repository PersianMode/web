import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-mobile-product',
  templateUrl: './mobile-product.component.html',
  styleUrls: ['./mobile-product.component.css']
})
export class MobileProductComponent implements OnInit {
  @Input() product;
  @Input() price;
  @Input() sub;
  @Input() id;
  @Input()
  set selectedProductColorID(id) {
    if (id) {
      this.selectedProductColor = this.product.colors.find(r => r._id === id);
      this.productSize = this.product.sizesByColor[id];
    }
  };
  productSize = [];
  selectedProductColor: any = {};
  addCardBtnDisabled = true;
  @Output() add = new EventEmitter<any>();
  @Output() changeSize = new EventEmitter<any>();
  size = '';

  constructor() { }

  newSize(event) {
    this.size = event;
    this.addCardBtnDisabled = !this.size;
    this.changeSize.emit(this.size);
  }

  ngOnInit() {
  }

  saveToCart() {
    this.add.emit(this.size);
  }
}
