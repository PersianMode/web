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
  constructor() { }

  ngOnInit() {
  }

}
