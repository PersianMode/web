import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {HttpService} from '../../../../shared/services/http.service';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {ProductService} from '../../../../shared/services/product.service';
import {DictionaryService} from '../../../../shared/services/dictionary.service';
import {Subscription} from 'rxjs/Subscription';
import {AddToCardConfirmComponent} from '../add-to-card-confirm/add-to-card-confirm.component';
import {CartService} from '../../../../shared/services/cart.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
  selectedProductColor;
  product: any = {};
  joinedTags = '';
  formattedPrice = '';
  isMobile = false;
  cartNumbers = null;
  size = '';
  private switch$: Subscription;
  private params$: Subscription;
  private product$: Subscription;

  constructor(public httpService: HttpService, private route: ActivatedRoute, @Inject(WINDOW) private window,
              private responsiveService: ResponsiveService, private productService: ProductService,
              private dict: DictionaryService, private cartService: CartService, private dialog: MatDialog) {
  }

  // this component we need to have a product data by this format :
  // productId and colorId or colorName all exist sizes of this colorId
  // all thumbnail of all colorIds, and just angle pictures of that special colorId that is showing in the browser,
  // i think we do not need to have all angle pic of all colorIds,
  // in every switch to thumbnails we need to have angles pictures to show in browser
  ngOnInit() {
    this.product = {};
    this.selectedProductColor = null;
    this.isMobile = this.responsiveService.isMobile;
    this.switch$ = this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.params$ = this.route.paramMap.subscribe(params => {
      const productId = params.get('product_id');
      const colorIdParam = params.get('color');
      if (!this.product || this.product.id !== productId || this.selectedProductColor !== colorIdParam) {
        this.productService.getProduct(productId);
        this.product$ = this.productService.product$.subscribe(data => {
          this.product = data;
          this.joinedTags = Array.from(new Set([... this.product.tags.map(t => this.dict.translateWord(t.name.trim()))])).join(' ');
          this.selectedProductColor = colorIdParam ? colorIdParam : this.product.colors[0]._id;
          this.updatePrice();
        });
      } else {
        this.selectedProductColor = colorIdParam ? colorIdParam : this.product.colors[0]._id;
      }
    });
  }

  ngOnDestroy(): void {
    this.switch$.unsubscribe();
    this.params$.unsubscribe();
    this.product$.unsubscribe();
  }

  updatePrice(size = this.size) {
    const instance = this.product.instances.find(el => el.product_color_id === this.selectedProductColor && el.size === size + '');
    const price = instance && instance.price ? instance.price : this.product.base_price;
    this.size = size;
    this.formattedPrice = priceFormatter(price);
  }

  saveToCart(size) {
    // check form size and id undefined
    this.size = size;
    const instance = this.product.instances.find(el => el.product_color_id === this.selectedProductColor && el.size === size + '');

    if (instance) {
      const object = {
        product_id: this.product._id,
        product_instance_id: instance._id,
      };

      Object.assign(object, this.product);

      this.cartService.saveItem(object);
      const rmDialog = this.dialog.open(AddToCardConfirmComponent, {
        position: this.isMobile ? {top: '50px', left: '0px'} : {top: '108px', right: '0px'},
        width: this.isMobile ? '100%' : '550px',
        data: {
          product: this.product,
          instance,
          selectedSize: size,
        }
      });
      setTimeout(function () {
        rmDialog.close();
      }, 3000);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 960;
  }
}
