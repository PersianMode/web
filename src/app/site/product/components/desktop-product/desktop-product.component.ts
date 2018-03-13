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
  size: number;
  productSize;
  cartNumbers = null;
  addCardBtnDisabled = true;

  @Input()
  set selectedProductColorID(id) {
    if (id) {
      this.selectedProductColor = this.product.colors.find(r => r.color._id === id);
    }
  };

  selectedProductColor: any = {};

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window,
              private cartService: CartService, private dialog: MatDialog) {
  }

  ngOnInit() {
  }


  saveToCart() {
    console.log('btnDisabled : ', this.addCardBtnDisabled);
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
    this.cartService.cartItems.subscribe(data => this.cartNumbers = priceFormatter(data.length));
    const rmDialog = this.dialog.open(AddToCardConfirmComponent, {
      position: {top: '5.5%', left: '20%'},
      width: '450px',
      data: {
        dialog_product: this.product,
        cartNumbers : this.cartNumbers,
        selectedSize : this.size,
      }
    });
    rmDialog.afterClosed().subscribe(
      (data) => {
      },
      (err) => {
        console.error('Error in dialog: ', err);
      }
    );
  }
  newSize($event) {
    this.size = $event;
    this.addCardBtnDisabled = false;
  }
  showAngles(colorId) {
    this.selected_product_color = this.product.colors.filter(el => el.color_id === colorId)[0];
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
