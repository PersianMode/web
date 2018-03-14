import {AfterContentChecked, Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
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
export class MainCollectionComponent implements OnInit, AfterContentChecked {
  collection: any = {
    products: [],
    collectionNameFa: '',
    collectionName: '',
  };
  @ViewChild('filterPane') filterPane;
  @ViewChild('gridwall') gridwall;
  topFixedFilterPanel = false;
  bottomFixedFilterPanel = false;
  bottomScroll = false;
  topDist = 0;
  innerHeight = 0;
  innerScroll = false;
  pageName = '';
  curWidth: number;
  curHeight: number;
  displayFilter = false;
  gridWidth: number;
  gridHeight: number;
  isMobile = false;
  sortOptions = [
    {
      value: 'newest',
      fa: 'تازه‌ترین‌ها',
    },
    {
      value: 'highest',
      fa: 'بالاترین امتیازها',
    },
    {
      value: 'cheapest',
      fa: 'ارزان‌ترین‌ها',
    },
    {
      value: 'most',
      fa: 'گران‌ترین‌ها',
    }
  ];
  sortedBy: any;

  constructor(private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window,
              private pageService: PageService, private responsiveService: ResponsiveService, private productService: ProductService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pageName = 'collection/' + params.get('typeName');
      console.log('page name : ', this.pageName);
      this.pageService.getPage(this.pageName);
      this.pageService.pageInfo$.subscribe(res => {
          if (res && res['collection_id']) {
            this.productService.loadProducts(res['collection_id']);
          } else {
            console.error('-> ', `${this.pageName} is getting empty data for page`);
          }
        },
        err => {
        }
      );
    });
    this.productService.collectionInfo$.subscribe(r => {
      // console.log('collection name : ', this.collection.collectionName);
      this.collection.collectionName = r;
    });
    this.productService.productList$.subscribe(r => {
      // console.log('products array : ', this.collection.products);
      this.collection.products = r;
    });
    this.calcWidth();
    this.responsiveService.resize$.subscribe(r => {
      this.calcWidth();
    });
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngAfterContentChecked() {
    this.calcAfterScroll();
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
    if (!this.isMobile && this.filterPane && this.gridwall) {
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

  selectSortOption(sortPanel, index) {
    sortPanel.hide();
    if (this.sortedBy && this.sortedBy.value === this.sortOptions[index].value) {
      this.sortedBy = null;
    } else {
      this.sortedBy = this.sortOptions[index];
    }
  }

  setDispalyFilter($event) {
    this.displayFilter = $event;
  }
}
