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
