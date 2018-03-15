import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {HttpService} from '../../../../shared/services/http.service';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {ProductService} from '../../../../shared/services/product.service';
import {DictionaryService} from '../../../../shared/services/dictionary.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  selectedProductColor;
  product: any = {};
  joinedTags = '';
  formattedPrice = '';
  isMobile = false;

  constructor(public httpService: HttpService, private route: ActivatedRoute, @Inject(WINDOW) private window,
              private responsiveService: ResponsiveService, private productService: ProductService,
              private dict: DictionaryService) {
  }

  // this component we need to have a product data by this format :
  // productId and colorId or colorName all exist sizes of this colorId
  // all thumbnail of all colorIds, and just angle pictures of that special colorId that is showing in the browser,
  // i think we do not need to have all angle pic of all colorIds,
  // in every switch to thumbnails we need to have angles pictures to show in browser
  ngOnInit() {
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.route.paramMap.subscribe(params => {
      const productId = params.get('product_id');
      const colorIdParam = params.get('color');
      if (!this.product || this.product.id !== productId) {
        this.productService.getProduct(productId);
        this.productService.product$.subscribe(data => {
          this.product = data;
          this.formattedPrice = priceFormatter(this.product.base_price);
          this.joinedTags = Array.from(new Set([... this.product.tags.map(t => this.dict.translateWord(t.name.trim()))])).join(' ');
          this.selectedProductColor = colorIdParam ? colorIdParam : this.product.colors[0].color_id;
        });
      } else {
        this.selectedProductColor = colorIdParam ? colorIdParam : this.product.colors[0].color_id;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 960;
  }
}
