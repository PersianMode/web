import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-product-grid-item',
  templateUrl: './product-grid-item.component.html',
  styleUrls: ['./product-grid-item.component.css']
})
export class ProductGridItemComponent implements OnInit {
  @Input('data') data;
  pos = 0;
  desc = '';
  price = '';
  on = false;

  constructor() { }
  ngOnInit() {
    this.desc = this.data.tags.join(' ');
    this.price = this.priceFormatter(this.data.price);
    this.images = this.data.colors.map(r => )
  }

  priceFormatter(p) {
    let ret = '';
    (p + '').split('').reverse().forEach((digit, ind) => {
      ret = parseInt(digit).toLocaleString('fa') + ret;
      if (ind % 3 === 2 && ind !== Math.floor(Math.log10(p))) {
        ret = '٫' + ret;
      }
    });
    return ret;
  }

  turnOn() {
    this.on = true;
  }

  turnOff() {
    this.on = false;
  }
}
