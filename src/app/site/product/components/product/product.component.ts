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
  id;
  colorId;
  /*  product: any = {
   id: 14,
   name: 'کایری ۳ مدل What The',
   tags: ['کفش', 'بسکتبال', 'نوجوانان'],
   desc: `# راحت
   *کایری ۳ مدل What The* کمک می‌کند به سرعت در هر جهتی حرکت کنید چون پاشنه‌های مدور منحصر به فردی دارد.

   * **رنگ نمایش داده شده**: طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی
   * **سبک**: AH2287-700`,
   price: 599000,
   sizes: [
   {
   size: 20,
   },
   {
   size: 22,
   },
   {
   size: 24,
   },
   {
   size: 28,
   oos: true,
   },
   {
   size: 30,
   oos: true,
   },
   {
   size: 32,
   },
   {
   size: 34,
   }
   ],
   colors: [
   {
   color_id: 101,
   images: {
   thumbnail: '11.jpeg',
   angles: [{
   type: 'video',
   url: 'assets/pictures/products/video.webm',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_009.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_019.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_020.jpg',
   }
   ]
   }
   },
   {
   color_id: 102,
   images: {
   thumbnail: '12.jpeg',
   angles: [{
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2.jpg',
   },
   {
   type: 'video',
   url: 'assets/pictures/products/video.webm',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_009.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_019.jpg',
   }
   ]
   }
   },
   {
   color_id: 103,
   images: {
   thumbnail: '13.jpeg',
   angles: [{
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_009.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_019.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_020.jpg',
   },
   {
   type: 'video',
   url: 'assets/pictures/products/video.webm',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_021.jpg',
   }
   ]
   }
   },
   {
   color_id: 104,
   images: {
   thumbnail: '14.jpeg',
   angles: [
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_009.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_019.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_023.jpg',
   },
   {
   type: 'video',
   url: 'assets/pictures/products/video.webm',
   }]
   }
   },
   {
   color_id: 105,
   images: {
   thumbnail: '11.jpeg',
   angles: [
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2.jpg',
   },
   {
   url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_009.jpg',
   },
   ]
   }
   },
   ],
   };*/
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
        let instancesArr = [];
        data[0].instances.forEach(instance => {
          let count = 0;
          let newObj = {value: instance.size};
          instance.inventory.forEach(elInv => {
            count = +elInv.count;
          });
          if (count <= 0) {
            newObj['disabled'] = true;
          }
          instancesArr.push(newObj);
        });
        this.product.sizes = instancesArr;
        this.product.colors = data[0].colors.map(color => {
          let _angles = [];
          color.images.slice(1, color.images.length).forEach(image => {
            if (image.split('.').pop(-1) === 'webm') {
              _angles.push({type: 'video', url: image});
            } else {
              _angles.push({url: image});
            }
          });
          return {color_id: color._id, images: {thumbnail: color.images[0], angles: _angles}}
        });
        this.formattedPrice = priceFormatter(data[0].base_price);
        // Todo Duplicate Tags
        this.joinedTags = data[0].tags.map(t => t.name).join(' ');

        this.colorId = params.get('color') ? +params.get('color') : data[0].colors && data[0].colors.length ? data[0].colors.map(color => color._id) : NaN;


      });
    });


  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 960;
  }
}
