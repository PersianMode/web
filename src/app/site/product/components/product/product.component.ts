import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {HttpService} from '../../../../shared/services/http.service';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {ProductService} from '../../../../shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  selectedProductColor;
  colorId;
  product: any = {};
  joinedTags = '';
  formattedPrice = '';
  isMobile = false;

  constructor(public httpService: HttpService, private route: ActivatedRoute, @Inject(WINDOW) private window,
              private responsiveService: ResponsiveService, private productService: ProductService) {
  }

  ngOnInit() {
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.route.paramMap.subscribe(params => {
      const productId = params.get('product_id');
      const colorIdParam = params.get('color');
      if (!this.product || this.product.id !== productId) {
        this.productService.getProduct(productId);
        this.productService.product$.subscribe(data => {
          this.product.id = data[0]._id;
          this.product.name = data[0].name;
          this.product.price = data[0].base_price;
          this.product.desc = data[0].desc;
          this.product.tags = data[0].tags.map(t => t.name).join(' ');
          this.product.instances = data[0].instances;
          data[0].colors.forEach(item => {
            let angles = [];
            item.image.angles.forEach(r => {
              if (!r.url) {
                const temp = {url: r, type: r.split('.').pop(-1) === 'webm' ? 'video' : 'photo'};
                angles.push(temp);
              } else {
                angles.push(r);
              }
            });
            item.image.angles = angles;
          });
          this.product.colors = data[0].colors;
          this.product.sizes = this.product.instances.map(instance => {
            const _sized = {value: instance.size, color_id: instance.product_color_id};
            instance.inventory.forEach(inner_el => {
              if (instance.product_color_id === colorIdParam && inner_el.count <= 0) {
                _sized['disabled'] = true;
              } else if (instance.product_color_id === this.product.colors[0].color_id && inner_el.count <= 0) {
                _sized['disabled'] = true;
              }
            });
            return _sized;
          });
          this.formattedPrice = priceFormatter(data[0].base_price);
          // Todo Duplicate Tags
          this.joinedTags = data[0].tags.map(t => t.name).join(' ');
          this.selectedProductColor = colorIdParam ? colorIdParam : this.product.colors[0]._id;
        });
      } else {
        this.selectedProductColor = colorIdParam ? colorIdParam : this.product.colors[0]._id;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 960;
  }
}
