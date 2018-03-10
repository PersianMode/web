import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

import {HttpService} from '../../../../shared/services/http.service';
import {ResponsiveService} from  '../../../../shared/services/responsive.service';

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

  constructor(public httpService: HttpService, private route: ActivatedRoute, @Inject(WINDOW) private window, private responsiveService: ResponsiveService) {
  }

  ngOnInit() {
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.route.paramMap.subscribe(params => {
      //todo get ProductId
      let productId = params.get('product_id');
      productId = '5a9cf71d2cc256bd21576eb0';
      this.httpService.get(`product/${productId}`).subscribe(data => {
        this.product.id = data[0]._id;
        this.product.name = data[0].name;
        this.product.price = data[0].base_price;
        this.product.desc = data[0].desc;
        this.product.tags = data[0].tags.map(t => t.name).join(' ');
        console.log("___________Data[0]",data[0]);
        let instancesArr = [];
        data[0].instances.forEach(instance => {
          let count = 0;
          let newObj = {value: instance.size, color_id: instance.product_color_id};
          instance.inventory.forEach(elInv => {
            count = +elInv.count;
          });
          if (count <= 0) {
            newObj['disabled'] = true;
          }
          instancesArr.push(newObj);
        });
        this.product.sizes = instancesArr;
        this.product.instances = data[0].instances;

        this.product.colors = data[0].colors.map(color => {
          let anglesArr = [];
          color['image'].angles.forEach(item => {
            let anglesObj = {url: item};
            if (item.split('.').pop(-1) === 'webm') {
              anglesObj['type'] = 'video'
            }
            anglesArr.push(anglesObj);
          });
          color['image']['angles'] = anglesArr;
          return color;
        });

        this.formattedPrice = priceFormatter(data[0].base_price);
        // Todo Duplicate Tags
        this.joinedTags = data[0].tags.map(t => t.name).join(' ');

        // Todo if "!" remove return params Color
        // this.colorId = !params.get('color') ? +params.get('color') : data[0].colors && data[0].colors.length ? data[0].colors.map(color => color._id)[0] : NaN;
        const colorIdParam = params.get('color');
        this.selectedProductColor = !colorIdParam ? this.product.colors[0] : this.product.colors.filter(color => color.color_id === colorIdParam)[0];

        console.log("_____Product",this.product);

      });
    });


  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 960;
  }
}
