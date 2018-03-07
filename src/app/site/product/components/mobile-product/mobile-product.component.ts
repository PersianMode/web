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
  selected_product_color = [];
  constructor() { }

  ngOnInit() {
    this.selected_product_color = this.product.colors[0];
  }
  showAngles(colorId) {
    this.selected_product_color = this.product.colors.filter(el => el.color_id === colorId)[0];
  }
}
