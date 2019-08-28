import {AfterContentInit, Component, HostListener, Inject, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {WINDOW} from '../../../../shared/services/window.service';
import {ActivatedRoute} from '@angular/router';
import {PageService} from '../../../../shared/services/page.service';
import {ProductService} from '../../../../shared/services/product.service';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {Subject, Subscription} from 'rxjs';
import {TitleService} from '../../../../shared/services/title.service';
import {AuthService} from 'app/shared/services/auth.service';
import {HttpService} from 'app/shared/services/http.service';
import {DictionaryService} from '../../../../shared/services/dictionary.service';


@Component({
  selector: 'app-main-collection',
  templateUrl: './main-collection.component.html',
  styleUrls: ['./main-collection.component.css']
})
export class MainCollectionComponent implements OnInit, OnDestroy, AfterContentInit {
  products = [];
  @ViewChild('filterPane') filterPane;
  @ViewChild('gridwall') gridwall;
  topDist = 0;
  title = '';
  pageName = '';
  curWidth: number;
  curHeight: number;
  displayFilter = false;
  gridWidth: number;
  gridHeight: number;
  isMobile = false;
  scroll$ = new Subject();
  totalRecords = 0;
  sortOptions = [
    {
      value: 'newest',
      fa: 'جدید‌ترین‌ها',
    },
    {
      value: 'most',
      fa: 'گران‌ترین‌ها',
    },
    {
      value: 'highest',
      fa: 'محبوب‌ترین‌ها',
    },
    {
      value: 'cheapest',
      fa: 'ارزان‌ترین‌ها',
    },
  ];
  sortedBy: any = {value: null};
  collectionName = '';
  collectionNameFa = '';
  tagId = [];
  typeId = [];
  lazyRows = 10;
  subscription: Subscription;
  lazyProducts = [];
  private _c;
  get category(){
    return this._c;
  };
  set category(v) {
    this._c = v ? v.trim() : '';
    this.showCategory = v && this.pageName.split('/')[1] !== v.trim();
  }
  parentPageName;
  parentCollectionName;
  showCategory = false;
  prevOffset = 0;
  littleScroll = true;
  justPassTheTop = false;
  footerVisible = true;

  constructor(private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document,
              @Inject(WINDOW) private window, private pageService: PageService,
              private httpService: HttpService,
              private responsiveService: ResponsiveService, private productService: ProductService,
              private titleService: TitleService, private authService: AuthService, private dict: DictionaryService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const prev = this.pageName.split('/');
      if (params.get('typeName')) {
        this.pageName = 'collection/' + params.get('typeName');
      }
      if (params.get('l1') || prev[1] !== params.get('typeName')) {
        if(prev[1] !== params.get('typeName')) {
          this.category = '';
        }
        this.parentPageName = this.pageName;
        this.parentCollectionName = params.get('typeName');
        this.pageService.getParentPage(this.parentPageName);
        this.pageService.pageInfo$
          .filter(p => p[0] === this.parentPageName && p[1] && p[1]['collection_id'])
          .map(p => p[1])
          .subscribe(res => {
            // check when customer logged in then product sort by tags that interested
            const tag = this.authService.userIsLoggedIn() ? 'tagsCustomerInterested' : null;
            // second parameter for set interested customer tags (when logged in)
            this.productService.loadParentProducts(res['collection_id'], tag);
          });
        if ((params.get('l1'))) {
          this.pageName += '/' + params.get('l1');
        }
      }
      if ((params.get('l2'))) {
        this.pageName += '/' + params.get('l2');
      }
      if ((params.get('l3'))) {
        this.pageName += '/' + params.get('l3');
      }
      this.pageService.getPage(this.pageName);
      this.subscription = this.pageService.pageInfo$.filter(r => r[0] === this.pageName).map(r => r[1]).subscribe(res => {
          this.title = res.title;
          if (res && res['collection_id']) {
            // check when customer logged in then product sort by tags that interested
            const tag = this.authService.userIsLoggedIn() ? 'tagsCustomerInterested' : null;
            // second parameter for set interested customer tags (when logged in)
            this.route.queryParams
              .map(p => p.category)
              .subscribe(category => {
                this.category = category;
                this.showCategory = category && prev[1] !== category;
                this.productService.loadCollectionProducts(res['collection_id'], tag, this.category);
              });
          } else {
            this.products = [];
            this.totalRecords = 0;
            this.lazyProducts = [];
            this.collectionNameFa = '';
            this.tagId = [];
            this.typeId = [];
            this.productService.emptyFilters();
            console.error('-> ', `${this.pageName} is getting empty data for page`);
          }
        },
        err => {
          console.error('Error when subscribing on pageInfo: ', err);
        }
      );
    });

    this.productService.collectionNameFa$.subscribe(r => {
      this.collectionNameFa = r;
      if (!this.title)
        this.titleService.setTitleWithConstant(TitleService.collection_name + ' ' + r);
      else
        this.titleService.setTitleWithConstant(this.title);
    });
    this.productService.productList$.subscribe(r => {
      this.lazyProducts = [];
      this.sortedBy = {value: null};
      this.products = r.slice(0);
      this.totalRecords = this.products.length;
      setTimeout(() => {
        this.calcAfterScroll();
        this.lazyLoad();
      }, 0);

    });
    this.calcWidth();
    this.responsiveService.resize$.subscribe(r => {
      this.calcWidth();
    });
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => {
      this.isMobile = isMobile;
      this.calcWidth();
    });

    this.scroll$.subscribe(() => this.calcAfterScroll());

  }


  ngAfterContentInit() {
    this.scroll$.next();
  }

  private calcWidth() {
    this.curWidth = this.responsiveService.curWidth;
    this.curHeight = this.responsiveService.curHeight;
    this.gridWidth = this.responsiveService.isMobile ? this.responsiveService.curWidth - 20 : Math.max((this.curWidth - 20) / Math.floor(this.curWidth / 244) - 10, 1708);
    this.gridHeight = this.responsiveService.isMobile ? this.gridWidth + 60 : this.gridWidth + 90;
    this.lazyRows = this.isMobile ? 3 :
      Math.round(Math.floor(this.gridWidth / 242) *
        Math.ceil((this.window.innerHeight - 105) / 348) * 1.5);
    setTimeout(() => this.calcAfterScroll(), 0);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scroll$.next();
  }

  calcAfterScroll() {
    if (!this.isMobile && this.filterPane && this.gridwall) {
      const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      const diff = offset - this.prevOffset;
      this.topDist += diff;
      this.filterPane.nativeElement.scroll({top: this.topDist});
      this.prevOffset = offset;
      const height = this.window.innerHeight;
      const docHeight = this.gridwall.nativeElement.scrollHeight;
      const filterHeight = this.filterPane.nativeElement.scrollHeight + 10;
      this.littleScroll = offset < 60;
      this.footerVisible = docHeight - offset < height - 214;
      if (this.footerVisible) {
        this.topDist = filterHeight - height + 109;
      }
      this.justPassTheTop = !this.footerVisible && offset > 60;
      if (!this.littleScroll && !this.footerVisible) {
        if (diff > 0) {
          if (this.topDist > filterHeight - height + 109)
            this.topDist = filterHeight - height + 109;
        } else {
          if (this.topDist < 0)
            this.topDist = 0;
        }
      } else if (this.littleScroll) {
        this.topDist = 0;
      }
    }

  }

  selectSortOption(sortPanel, index) {
    sortPanel.hide();
    if (this.sortedBy && this.sortedBy.value === this.sortOptions[index].value) {
      this.sortedBy = {value: null};
    } else {
      this.sortedBy = this.sortOptions[index];
    }
    this.emitSortedBy();
  }

  mobileSortOptionChange(sortedBy) {
    this.sortedBy = sortedBy;
    this.emitSortedBy();
  }

  emitSortedBy() {
    this.productService.setSort(this.sortedBy.value);
  }

  setDispalyFilter($event) {
    this.displayFilter = $event;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  lazyLoad() {
    this.lazyProducts = this.lazyProducts.concat(this.products.splice(0, this.lazyRows));
    setTimeout(() => this.calcAfterScroll(), 100);
  }
}
