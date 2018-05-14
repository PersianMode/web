import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {AuthService} from '../../../../shared/services/auth.service';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {TitleService} from '../../../../shared/services/title.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
  selectedProductColorID;
  product: any = {};
  joinedTags = '';
  formattedPrice = '';
  discountedPrice = '';
  discounted = false;
  isMobile = false;
  size = '';
  gender = 'MENS';
  waiting = false;
  productType = '';
  color = '';
  barcode = '';
  private switch$: Subscription;
  private params$: Subscription;
  private product$: Subscription;

  constructor(public httpService: HttpService, private route: ActivatedRoute, @Inject(WINDOW) private window,
              private responsiveService: ResponsiveService, private productService: ProductService,
              private dict: DictionaryService, private cartService: CartService, private dialog: MatDialog,
              private authService: AuthService, private router: Router, private titleService: TitleService) {
  }

  // this component we need to have a product data by this format :
  // productId and colorId or colorName all exist sizes of this colorId
  // all thumbnail of all colorIds, and just angle pictures of that special colorId that is showing in the browser,
  // i think we do not need to have all angle pic of all colorIds,
  // in every switch to thumbnails we need to have angles pictures to show in browser
  ngOnInit() {
    this.product = {};
    this.selectedProductColorID = null;
    this.isMobile = this.responsiveService.isMobile;
    this.switch$ = this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.params$ = this.route.paramMap.subscribe(params => {
      const productId = params.get('product_id');
      const colorIdParam = params.get('color');
      if (!this.product || this.product.id !== productId || this.selectedProductColorID !== colorIdParam) {
        this.productService.getProduct(productId);
        this.product$ = this.productService.product$.subscribe(data => {
          this.product = data;
          this.product.colors = data.colors.map(c => Object.assign(c, {translatedName: this.dict.translateColor(c)}));
          this.titleService.setTitleWithConstant(this.product.name);
          this.joinedTags = Array.from(new Set([... this.product.tags.map(t => this.dict.translateWord(t.name.trim()))])).join(' ');
          this.selectedProductColorID = colorIdParam ? colorIdParam : this.product.colors[0]._id;
          this.updatePrice();
          if (this.product.id) {
            this.gender = this.product.tags.find(tag => tag.tg_name.toUpperCase() === 'GENDER').name;
            this.productType = this.product.type.name || this.product.type;
          }
          this.setColor();
        });
      } else {
        this.selectedProductColorID = colorIdParam ? colorIdParam : this.product.colors[0]._id;
        this.setColor();
      }
    });
  }

  private setColor() {
    const col = this.product.colors.find(el => el._id === this.selectedProductColorID);
    this.color = col ? col.translatedName : '';
  }

  ngOnDestroy(): void {
    this.switch$.unsubscribe();
    this.params$.unsubscribe();
    this.product$.unsubscribe();
  }

  updatePrice(size = this.size) {
    const instance = this.product.instances.find(el => el.product_color_id === this.selectedProductColorID && el.size === size + '');
    const color = this.product.colors.find(el => el._id === this.selectedProductColorID);
    const price = instance && instance.price ? instance.price : color && color.price ? color.price : this.product.base_price;
    this.discountedPrice = priceFormatter(instance && instance.discountedPrice ? instance.discountedPrice : color && color.discountedPrice ? color.discountedPrice : price);
    this.size = size;
    this.formattedPrice = priceFormatter(price);
    this.discounted = this.formattedPrice !== this.discountedPrice;
    this.barcode = instance ? instance.barcode : '';
  }

  saveToCart(size) {
    // check form size and id undefined
    this.size = size;
    const instance = this.product.instances.find(el => el.product_color_id === this.selectedProductColorID && el.size === size + '');

    if (instance) {
      const object = Object.assign({}, this.product);

      Object.assign(object, {
        product_id: this.product._id,
        product_instance_id: instance._id,
        product_type: this.productType,
        discountedPrice: instance.discountedPrice,
      });

      this.cartService.saveItem(object);
      this.waiting = true;
      const sub = this.cartService.itemAdded$.filter(r => r === true)
        .subscribe(() => {
          this.waiting = false;
          const rmDialog = this.dialog.open(AddToCardConfirmComponent, {
            position: this.isMobile ? {top: '50px', left: '0px'} : {top: '108px', right: '0px'},
            width: this.isMobile ? '100%' : '750px',
            data: {
              product: this.product,
              instance,
              selectedSize: size,
            }
          });
          setTimeout(function () {
            rmDialog.close();
            sub.unsubscribe();
          }, 3000);
        });

      setTimeout(() => {
        if (sub)
          sub.unsubscribe();
        this.waiting = false;
      }, 10000);
    }
  }

  saveToFavorites(size) {
    if (this.authService.isLoggedIn.getValue()) {
      this.size = size;
      const instance = this.product.instances.find(el => el.product_color_id === this.selectedProductColorID && el.size === size + '');
      if (instance) {
        const favoriteObject = {
          product_id: this.product._id,
          product_instance_id: instance._id,
          instances: this.product.instances,
        };

        Object.assign(favoriteObject, this.product);
        this.cartService.saveFavoriteItem(favoriteObject);
      }
    } else this.goToRegister(size);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 960;
  }

  goToRegister(size) {
    // this.window.innerWidth >= 960
    if (size) {
      if (!this.isMobile) {
        this.dialog.open(GenDialogComponent, {
          width: '500px',
          data: {
            componentName: DialogEnum.login,
          }
        });
      } else {
        this.router.navigate(['login']);
      }
    }
  }
}
