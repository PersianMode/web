import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id;
  colorId;
  mobileView = false;
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
        url: '11.jpeg',
        pcid: 10,
      },
      {
        url: '12.jpeg',

      },
      {
        url: '13.jpeg',

      },
      {
        url: '14.jpeg',
        pcid: 14,

      },
      {
        url: '11.jpeg',

      },
      {
        url: '12.jpeg',

      },
      {
        url: '13.jpeg',

      },
      {
        url: '14.jpeg',

      },

    ],
    images: [
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
    ]
  };
  joinedTags = '';
  formattedPrice = '';

  constructor(private route: ActivatedRoute, @Inject(WINDOW) private window) {
  }

  ngOnInit() {
    this.mobileView = this.window.innerWidth < 960;
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('product_id');
      this.product.id = this.id;
      this.colorId =  params.get('color') ? +params.get('color')
                      : this.product.colors && this.product.colors.length ? this.product.colors.map(r => r.pcid)[0]
                      : null;
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
    this.mobileView = event.target.innerWidth < 960;
  }
}
