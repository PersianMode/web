import {Component, Input, OnInit} from '@angular/core';

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
      this.selectedProductColor = this.product.colors.find(r => r.color._id === id);
    }
  };
  @Input() productSize;
  selectedProductColor: any = {};
  constructor() { }

  ngOnInit() {
  }
}
