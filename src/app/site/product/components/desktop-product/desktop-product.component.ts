import {
  Component, HostListener, Inject, Input, OnInit, Output, ViewChild, EventEmitter, AfterContentChecked
} from '@angular/core';
import {Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {DOCUMENT} from '@angular/platform-browser';
import {CartService} from '../../../../shared/services/cart.service';
import {HttpService} from 'app/shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';

@Component({
  selector: 'app-desktop-product',
  templateUrl: './desktop-product.component.html',
  styleUrls: ['./desktop-product.component.css']
})
export class DesktopProductComponent implements OnInit, AfterContentChecked {
  @Input() product;
  @Input() price;
  @Input() discountedPrice;
  @Input() discounted;
  @Input() sub;
  @Input() gender;
  @Output() changeSize = new EventEmitter<any>();
  @Input() productType;
  @Input() color;
  @Input() barcode;

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
    if (id && this.product.colors) {
      this.selectedProductColor = this.product.colors.find(r => r._id === id)
      this.productSize = this.product.sizesByColor[id];
    }
  };

  selectedProductColor: any = {};

  @Output() add = new EventEmitter<any>();
  @Output() addFavorite = new EventEmitter<any>();

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window,
    private cartService: CartService, private snackBar: MatSnackBar, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.cartService.itemAdded$.subscribe(r => this.addCardBtnDisabled = !r);
  }

  saveToCart() {
    this.add.emit(this.size);
  }

  saveToFavorites() {
    this.addFavorite.emit(this.size);
  }

  newSize(event) {
    this.size = event;
    this.addCardBtnDisabled = !this.size;
    this.changeSize.emit(this.size);
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

  fullSizeView(url) {
    const img: HTMLImageElement = new Image();
    let w, h;
    img.onload = () => {
      w = img.naturalWidth;
      h = img.naturalHeight;
      this.dialog.open(GenDialogComponent, {
        width: Math.min(w, window.innerWidth) + 'px',
        height: Math.min(h, window.innerHeight) + 'px',
        data: {
          componentName: DialogEnum.photoFullSize,
          extraData: {url, w, h, covering: w >= window.innerWidth && h >= window.innerHeight}
        }
      });
    };
    img.src = url;
  }
}
