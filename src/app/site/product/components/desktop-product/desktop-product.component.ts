import {Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {DOCUMENT} from '@angular/platform-browser';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-desktop-product',
  templateUrl: './desktop-product.component.html',
  styleUrls: ['./desktop-product.component.css']
})
export class DesktopProductComponent implements OnInit {

  id;
  collection = {
    collectionNameFa: 'تازه‌های مردانه',
    collectionName: 'men-shoes',
    set: [
      {
        name: 'جوردن ایر مدل ‍۱۰ رترو',
        colors: [
          {
            url: '06.jpg',
            position: 0,
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 499900,
      },
      {
        name: 'کایری ۳ مدل What The',
        colors: [
          {
            url: '14.jpeg',
            position: 0,
            pi_id: 14,
          },
        ],
        tags: ['کفش', 'بسکتبال', 'نوجوانان'],
        price: 599000,
      },
      {
        name: 'له‌برون مدل 15 BHM',
        colors: [
          {
            url: '01.jpg',
            position: 0,
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 1499900,
      },
      {
        name: 'نایک ایر مدل Huarache Drift',
        colors: [
          {
            url: '02.jpg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '02.jpg',
            position: 1,
            pi_id: 0,
          },
          {
            url: '02.jpg',
            position: 2,
            pi_id: 0,
          },
          {
            url: '11.jpeg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '12.jpeg',
            position: 0,
            pi_id: 0,
          },
        ],
        tags: ['کفش', 'مردانه'],
        price: 1499900,
      },
      {
        name: 'نایک ایر',
        colors: [
          {
            url: '03.jpg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '03.jpg',
            position: 1,
            pi_id: 1,
          },
        ],
        tags: ['تاپ', 'نیم‌زیپ', 'مردانه'],
        price: 499900,
      },
      {
        name: 'نایک ایر فورس ۱ مدل Premium \'07',
        colors: [
          {
            url: '04.jpg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '04.jpg',
            position: 1,
            pi_id: 0,
          },
          {
            url: '04.jpg',
            position: 2,
            pi_id: 0,
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 1099900,
      },
      {
        name: 'کایری 4',
        colors: [
          {
            url: '05.jpg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '05.jpg',
            position: 1,
            pi_id: 0,
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 799900,
      },
      {
        name: 'نایک Sportswear',
        colors: [
          {
            url: '07.jpg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '07.jpg',
            position: 1,
            pi_id: 0,
          },
          {
            url: '07.jpg',
            position: 2,
            pi_id: 0,
          },
        ],
        tags: ['جکت', 'مردانه'],
        price: 899900,
      },
      {
        name: 'نایک Sportswear Tech Shield',
        colors: [
          {
            url: '08.jpg',
            position: 0,
            pi_id: 0,
          },
          {
            url: '08.jpg',
            position: 1,
            pi_id: 0,
          },
          {
            url: '08.jpg',
            position: 2,
            pi_id: 0,
          },
        ],
        tags: ['جکت', 'مردانه'],
        price: 1399900,
      },
      {
        name: 'نایک مدل Kobe A.D. Black Mamba',
        colors: [
          {
            url: '13.jpeg',
            position: 0,
            pi_id: 0,
          },
        ],
        tags: ['کفش', 'مردانه', 'بسکتبال'],
        price: 999900,
      },
    ]
  };
  @ViewChild('descPane') descPane;
  @ViewChild('photosDiv') photosDiv;
  topFixedFilterPanel = false;
  bottomFixedFilterPanel = false;
  bottomScroll = false;
  topDist = 0;
  innerHeight = 0;
  innerScroll = false;
  product = {
    name: 'کایری ۳ مدل What The',
    tags: ['کفش', 'بسکتبال', 'نوجوانان'],
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
    colors: [],
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
  }
  joinedTags = '';
  price = '';
  size: number;

  constructor(private route: ActivatedRoute, private router: Router, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('product_id');
    });
    this.joinedTags = this.product.tags.join(' ');
    this.price = priceFormatter(this.product.price);
  }

  up() {
    this.router.navigate(['product', +this.id + 1]);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const height = this.window.innerHeight - 209;
    const filterHeight = this.descPane.nativeElement.scrollHeight;
    const docHeight = this.photosDiv.nativeElement.scrollHeight + 209;
    this.innerScroll = docHeight - filterHeight < 0;
    this.innerHeight = docHeight - 261;
    this.topFixedFilterPanel = !this.innerScroll && offset >= 65 && filterHeight < height;
    this.bottomScroll = docHeight - offset - height < 180;
    this.bottomFixedFilterPanel = !this.innerScroll && !this.topFixedFilterPanel && !this.bottomScroll && filterHeight - offset < height && offset >= 65;
    this.topDist = height - filterHeight + 209;
  }

}
