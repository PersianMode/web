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

const HEADER_HEIGHT = 209;

@Component({
  selector: 'app-main-collection',
  templateUrl: './main-collection.component.html',
  styleUrls: ['./main-collection.component.css']
})
export class MainCollectionComponent implements OnInit, OnDestroy, AfterContentInit {
  products = [];
  @ViewChild('filterPane') filterPane;
  @ViewChild('gridwall') gridwall;
  topFixedFilterPanel = false;
  bottomFixedFilterPanel = false;
  bottomScroll = false;
  topDist = 0;
  innerHeight = 0;
  title = '';
  innerScroll = false;
  pageName = '';
  curWidth: number;
  curHeight: number;
  displayFilter = false;
  gridWidth: number;
  gridHeight: number;
  isMobile = false;
  scroll$ = new Subject();
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

  constructor(private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document,
              @Inject(WINDOW) private window, private pageService: PageService,
              private httpService: HttpService,
              private responsiveService: ResponsiveService, private productService: ProductService,
              private titleService: TitleService, private authService: AuthService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('typeName')) {
        this.pageName = 'collection/' + params.get('typeName');
      }
      if ((params.get('l1'))) {
        this.pageName += '/' + params.get('l1');
      }
      if ((params.get('l2'))) {
        this.pageName += '/' + params.get('l2');
      }
      this.pageService.getPage(this.pageName);
      this.subscription = this.pageService.pageInfo$.filter(r => r[0] === this.pageName).map(r => r[1]).subscribe(res => {
          this.title = res.title;
          if (res && res['collection_id']) {
            // check when customer logged in then product sort by tags that insterested
            const tag = this.authService.userIsLoggedIn() ? 'tagsCustomerInterested' : null;
            // second parameter for set interested customer tags (when logged in)
            this.productService.loadCollectionProducts(res['collection_id'], tag);
          } else {
            this.products = [];
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

      this.sortedBy = {value: null};
      this.products = r;
      console.log('//////////', this.products);
      setTimeout(() => this.calcAfterScroll(), 1000);
    });
    this.calcWidth();
    this.responsiveService.resize$.subscribe(r => {
      this.calcWidth();
    });
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);

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
    this.lazyRows = this.isMobile ? 10 :
      Math.round(Math.floor(this.gridWidth / 242) *
        Math.ceil((this.window.innerHeight - 105) / 348) * 1.5);
    setTimeout(() => this.calcAfterScroll(), 1000);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scroll$.next();
  }

  calcAfterScroll() {

    if (!this.isMobile && this.filterPane && this.gridwall) {
      const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      const height = this.window.innerHeight - HEADER_HEIGHT;
      const filterHeight = this.filterPane.nativeElement.scrollHeight;
      const docHeight = this.gridwall.nativeElement.scrollHeight + HEADER_HEIGHT;
      this.innerScroll = docHeight - filterHeight < 100;
      this.innerHeight = docHeight - HEADER_HEIGHT;
      this.topFixedFilterPanel = !this.innerScroll && offset >= 65 && filterHeight < height;
      this.bottomScroll = !this.innerScroll && offset >= 65 && (docHeight - offset - height < 180);
      this.bottomFixedFilterPanel = !this.innerScroll && !this.topFixedFilterPanel && offset >= 65 &&
        !this.bottomScroll && filterHeight - offset < height - HEADER_HEIGHT;
      this.topDist = height - filterHeight + HEADER_HEIGHT;
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
}
