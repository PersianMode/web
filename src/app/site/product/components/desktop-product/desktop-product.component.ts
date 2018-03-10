import {Component, HostListener, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {DOCUMENT} from '@angular/platform-browser';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-desktop-product',
  templateUrl: './desktop-product.component.html',
  styleUrls: ['./desktop-product.component.css']
})
export class DesktopProductComponent implements OnInit {
  @Input() product;
  @Input() price;
  @Input() sub;

  @Input()
  set id(value) {
    this._id = value;
  }

  get id() {
    return this._id;
  }

  private _id;
  @ViewChild('descPane') descPane;
  @ViewChild('photosDiv') photosDiv;
  topFixedFilterPanel = false;
  bottomFixedFilterPanel = false;
  bottomScroll = false;
  topDist = 0;
  innerHeight = 0;
  innerScroll = false;
  size: number;
  productSize ;
  // selected_product_color = [];
  @Input() productColorSelected;
  _product :any = {};

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window) {
  }

  ngOnInit() {
    this._product = this.product
    // this.selected_product_color = this.id ? this.product.colors.filter(el => el.color_id === this.id) : this.product.colors[0];
    // console.log("selected_product_color______",this.selected_product_color);

  }

  up() {
    this.router.navigate(['product', +this.id + 1]);
  }


  showAngles(colorId) {
    this.productColorSelected = [];
    this.productSize = [];
    this.productColorSelected = this.product.colors.filter(el => el.color_id === colorId)[0];


    this.productSize = this._product.instances.map(instance => {
      let _sized = {value: instance.size, color_id: instance.product_color_id};
      instance.inventory.forEach(inner_el => {
        if (instance.product_color_id === colorId && inner_el.count <= 0) {
          _sized['disabled'] = true
        }
      });
      return _sized;
    });
    console.log("____productSize",this.productSize);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const height = this.window.innerHeight - 209;
    const filterHeight = this.descPane.nativeElement.scrollHeight;
    const docHeight = this.photosDiv.nativeElement.scrollHeight + 209;
    this.innerScroll = docHeight - filterHeight < 0;
    this.innerHeight = docHeight - 261;
    this.topFixedFilterPanel = !this.innerScroll && offset >= 65 && filterHeight < height;
    this.bottomScroll = docHeight - offset - height < 180;
    this.bottomFixedFilterPanel = !this.innerScroll && !this.topFixedFilterPanel && !this.bottomScroll
      && filterHeight - offset < height && offset >= 65;
    this.topDist = height - filterHeight + 209;
  }

}
