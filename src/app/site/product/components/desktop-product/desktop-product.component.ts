import {Component, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {DOCUMENT} from '@angular/platform-browser';
import {CartService} from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-desktop-product',
  templateUrl: './desktop-product.component.html',
  styleUrls: ['./desktop-product.component.css']
})
export class DesktopProductComponent implements OnInit {
  @Input() product;
  @Input() price;
  @Input() sub;
  @Input() id;
  @ViewChild('descPane') descPane;
  @ViewChild('photosDiv') photosDiv;
  topFixedFilterPanel = false;
  bottomFixedFilterPanel = false;
  bottomScroll = false;
  topDist = 0;
  innerHeight = 0;
  innerScroll = false;
  size: number;
  selected_product_color: any;

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window,
              private cartService: CartService) {
  }

  ngOnInit() {
    this.selected_product_color = this.product.colors[0];
  }

  up() {
    this.router.navigate(['product', +this.id + 1]);
  }

  saveToCart() {
    // check form size and id undefined
    const object: any = {};
    object.name = this.product.name;
    object.instance_id = this.product.id;
    object.tags = this.product.tags;
    object.price = this.product.price;
    object.size = (!this.size ? 0 : this.size);
    object.thumbnail = this.selected_product_color.images.thumbnail;
    object.quantity = 1;
    object.color = {};
    object.color.color_id = (!this.id ? 0 : this.id);
    // object.color.name= this.product.colorText;
    object.discount = '';
    object.instances = []; // instances not available
    this.cartService.saveItem(object);
  }

  showAngles(colorId) {
    this.selected_product_color = this.product.colors.filter(el => el.color_id === colorId)[0];
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
