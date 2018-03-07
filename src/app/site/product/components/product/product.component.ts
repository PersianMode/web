import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {HttpService} from '../../../../shared/services/http.service';
// import {IProduct} from '../../../../shared/interfaces/iproduct.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id;
  colorId;
  mobileView = false;
  // product: any = {
  //   id: 14,
  //   name: 'کایری ۳ مدل What The',
  //   tags: ['کفش', 'بسکتبال', 'نوجوانان'],
  //   desc: `# راحت
  //   *کایری ۳ مدل What The* کمک می‌کند به سرعت در هر جهتی حرکت کنید چون پاشنه‌های مدور منحصر به فردی دارد.
  //
  //   * **رنگ نمایش داده شده**: طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی
  //   * **سبک**: AH2287-700`,
  //   price: 599000,
  //   sizes: [
  //     {
  //       size: 20,
  //     },
  //     {
  //       size: 22,
  //     },
  //     {
  //       size: 24,
  //     },
  //     {
  //       size: 28,
  //       oos: true,
  //     },
  //     {
  //       size: 30,
  //       oos: true,
  //     },
  //     {
  //       size: 32,
  //     },
  //     {
  //       size: 34,
  //     }
  //   ],
  //   colors: [
  //     {
  //       url: '11.jpeg',
  //       pcid: 10,
  //     },
  //     {
  //       url: '12.jpeg',
  //
  //     },
  //     {
  //       url: '13.jpeg',
  //
  //     },
  //     {
  //       url: '14.jpeg',
  //       pcid: 14,
  //
  //     },
  //     {
  //       url: '11.jpeg',
  //
  //     },
  //     {
  //       url: '12.jpeg',
  //
  //     },
  //     {
  //       url: '13.jpeg',
  //
  //     },
  //     {
  //       url: '14.jpeg',
  //
  //     },
  //
  //   ],
  //   images: [
  //     {
  //       type: 'video',
  //       url: 'assets/pictures/products/video.webm',
  //     },
  //     {
  //       url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2.jpg',
  //     },
  //     {
  //       url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_009.jpg',
  //     },
  //     {
  //       url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_019.jpg',
  //     },
  //     {
  //       url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_020.jpg',
  //     },
  //     {
  //       url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_021.jpg',
  //     },
  //     {
  //       url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_022.jpg',
  //     },
  //     {
  //       url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_023.jpg',
  //     },
  //   ]
  // };
  product: any = {};
  joinedTags = '';
  formattedPrice = '';
  defaultImage = [
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
    }];

  constructor(private route: ActivatedRoute, @Inject(WINDOW) private window, public httpService: HttpService) {
  }

  ngOnInit() {
    this.mobileView = this.window.innerWidth < 960;
    this.route.paramMap.subscribe(params => {
      let productId = params.get('product_id');
      productId = '5a9cf71a2cc256bd215765b9';
      this.httpService.get(`product/${productId}`).subscribe(data => {
        console.log('_______________-', data[0]);
        this.product = data[0];
        const colorId = params.get('color') ? +params.get('color')
          : this.product['colors'] && this.product['colors'].length ? this.product['colors'][0]._id
            : NaN;
        // TODO: remove below lines - it is just for making a working mock
        if (colorId) {
          const colorObj = this.product.colors.find(c => c._id === colorId);
          this.product['images'] = colorObj && colorObj.images && colorObj.images.length ? colorObj.images : this.defaultImage;
        } else {
          this.product['images'] = this.defaultImage;
        }


        this.joinedTags = this.product.tags.map(t => t.name).join(' ');
        this.formattedPrice = priceFormatter(this.product.base_price);
      });

    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileView = event.target.innerWidth < 960;
  }
}
