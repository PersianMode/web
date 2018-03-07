import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

import {ResponsiveService} from  '../../../../shared/services/responsive.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id;
  colorId;
  product: any = {
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
        color_id : 101,
        images: {
          thumbnail : '11.jpeg',
          angles : [{
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
        color_id : 102,
        images: {
          thumbnail : '12.jpeg',
          angles : [{
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
        color_id : 103,
        images: {
          thumbnail : '13.jpeg',
          angles : [{
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
        color_id : 104,
        images: {
          thumbnail : '14.jpeg',
          angles : [
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
        color_id : 105,
        images: {
          thumbnail : '11.jpeg',
          angles : [
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
  };
  joinedTags = '';
  formattedPrice = '';
  isMobile = false;

  constructor(private route: ActivatedRoute, @Inject(WINDOW) private window, private responsiveService: ResponsiveService) {
  }

  ngOnInit() {
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('product_id');
      this.product.id = this.id;
      this.colorId =  params.get('color') ? +params.get('color')
        : this.product.colors && this.product.colors.length ? this.product.colors.map(r => r.pcid)[0]
          : NaN;
      // TODO: remove below lines - it is just for making a working mock
      if (this.colorId === 10) {
        this.product.images = [
          {
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
          },
          {
            url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_021.jpg',
          },
          {
            url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_022.jpg',
          },
          {
            url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_023.jpg',
          },
        ];
      } else {
        this.product.images = [
          {
            url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_023.jpg'
          },
          {
            url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_022.jpg',
          },
          {
            url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_019.jpg',
          },
        ];
      }
      // TODO: remove above lines - it is just for making a working mock
    });
    this.joinedTags = this.product.tags.join(' ');
    this.formattedPrice = priceFormatter(this.product.price);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 960;
  }
}
