import {Component, HostListener, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {WINDOW} from '../../../../shared/services/window.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PageService} from '../../../../shared/services/page.service';
import {ProductService} from '../../../../shared/services/product.service';
import {ResponsiveService} from '../../../../shared/services/responsive.service';


@Component({
  selector: 'app-main-collection',
  templateUrl: './main-collection.component.html',
  styleUrls: ['./main-collection.component.css']
})
export class MainCollectionComponent implements OnInit, OnDestroy {

  collection: any = {
    collectionName: '',
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
            pi_id: 0,
            position: 0,
          },
          {
            url: '02.jpg',
            pi_id: 0,
            position: 1,
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

  @ViewChild('filterPane') filterPane;
  @ViewChild('gridwall') gridwall;
  topFixedFilterPanel = false;
  bottomFixedFilterPanel = false;
  bottomScroll = false;
  topDist = 0;
  innerHeight = 0;
  innerScroll = false;
  curWidth: number;
  curHeight: number;
  displayFilter = false;
  gridWidth: number;
  gridHeight: number;
  isMobile = false;

  pageName = '';
  collectionName = '';
  products: any[] = [];

  page$: any;
  product$: any;
  collectionInfo$: any;

  constructor(private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window,
              private pageService: PageService, private responsiveService: ResponsiveService, private productService: ProductService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.pageName = 'collection/' + params.get('typeName');
      this.pageService.getPage(this.pageName);

      this.page$ = this.pageService.pageInfo$.subscribe(res => {
          if (res && res['collection_id']) {
            this.productService.loadProducts(res['collection_id']);
          } else {
            console.error('-> ', 'collection id is not defined for this page');
          }
        },
        err => {
          console.error('-> ', `${this.pageName} is getting empty data for page`);
        }
      );
      setTimeout(() => this.onWindowScroll(), 1000);
    });

    this.product$ = this.productService.productList$.subscribe(res => {
      this.products = res;
      console.log('-> ', this.products);
    }, err => {
      console.error('-> ', `cannot get products form product service`);
    });

    this.collectionInfo$ = this.productService.collectionInfo$.subscribe(res => {
      this.collectionName = res;
    }, err => {
      console.error('-> ', `cannot get collection info from products service`);
    });

    this.calcWidth();
    this.responsiveService.resize$.subscribe(r => {
      this.calcWidth();
    });
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
  }

  private calcWidth() {
    this.curWidth = this.responsiveService.curWidth;
    this.curHeight = this.responsiveService.curHeight;
    this.gridWidth = (this.curWidth - 20) / Math.floor(this.curWidth / 244) - 10;
    this.gridHeight = this.gridWidth + 76;
    setTimeout(() => this.calcAfterScroll(), 1000);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.calcAfterScroll();
  }

  calcAfterScroll() {
    if (!this.isMobile) {
      const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      const height = this.window.innerHeight - 209;
      const filterHeight = this.filterPane.nativeElement.scrollHeight;
      const docHeight = this.gridwall.nativeElement.scrollHeight + 209;
      this.innerScroll = docHeight - filterHeight < 100;
      this.innerHeight = docHeight - 209;
      this.topFixedFilterPanel = !this.innerScroll && offset >= 65 && filterHeight < height;
      this.bottomScroll = !this.innerScroll && offset >= 65 && (docHeight - offset - height < 180);
      this.bottomFixedFilterPanel = !this.innerScroll && !this.topFixedFilterPanel && offset >= 65 &&
        !this.bottomScroll && filterHeight - offset < height - 209;
      this.topDist = height - filterHeight + 209;
    }
  }

  setDispalyFilter($event) {
    this.displayFilter = $event;
  }

  ngOnDestroy(): void {
    this.product$.unsubscribe();
    this.page$.unsubscribe();
  }

}
