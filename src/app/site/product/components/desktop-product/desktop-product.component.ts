import {
  Component, HostListener, Inject, Input, OnInit, Output, ViewChild, EventEmitter,
  OnDestroy, AfterContentChecked
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {DOCUMENT} from '@angular/platform-browser';
import {CartService} from '../../../../shared/services/cart.service';
import {MatDialog} from '@angular/material';
import {AddToCardConfirmComponent} from '../add-to-card-confirm/add-to-card-confirm.component';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {$} from 'protractor';

@Component({
  selector: 'app-desktop-product',
  templateUrl: './desktop-product.component.html',
  styleUrls: ['./desktop-product.component.css']
})
export class DesktopProductComponent implements OnInit, AfterContentChecked {
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
  size: any;
  productSize;
  addCardBtnDisabled = true;
  focused: any = {};

  @Input()
  set selectedProductColorID(id) {
    if (id) {
      this.selectedProductColor = this.product.colors.find(r => r._id === id);
      this.productSize = this.product.sizesByColor[id];
    }
  };

  selectedProductColor: any = {};

  @Output() add = new EventEmitter<any>();

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window) {
  }

  ngOnInit() {
    console.log(this.product);
  }

  saveToCart() {
    this.add.emit(this.size);
  }

  newSize(event) {
    this.size = event;
    this.addCardBtnDisabled = !this.size;
  }

  ngAfterContentChecked() {
    this.onScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.onScroll();
  }

  private onScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const height = this.window.innerHeight - 209;
    const filterHeight = this.descPane.nativeElement.scrollHeight;
    const docHeight = this.photosDiv.nativeElement.scrollHeight + 209;
    this.innerScroll = docHeight - filterHeight < 100;
    this.innerHeight = docHeight - 209;
    this.topFixedFilterPanel = !this.innerScroll && offset >= 65 && filterHeight < height;
    this.bottomScroll = !this.innerScroll && offset >= 65 && (docHeight - offset - height < 180);
    this.bottomFixedFilterPanel = !this.innerScroll && !this.topFixedFilterPanel && offset >= 65 &&
      !this.bottomScroll && filterHeight - offset < height - 209;
    this.topDist = height - filterHeight + 209;
  }

}
