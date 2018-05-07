import {AfterContentInit, Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {WINDOW} from '../../../../shared/services/window.service';
import {ActivatedRoute} from '@angular/router';
import {PageService} from '../../../../shared/services/page.service';
import {ProductService} from '../../../../shared/services/product.service';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {Subject} from 'rxjs/Subject';
import {TitleService} from '../../../../shared/services/title.service';

const HEADER_HEIGHT = 209;

@Component({
  selector: 'app-main-collection',
  templateUrl: './main-collection.component.html',
  styleUrls: ['./main-collection.component.css']
})
export class MainCollectionComponent implements OnInit, AfterContentInit {
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
  sortedBy: any = {value: null};
  collectionName = '';
  collectionNameFa = '';
  showWaitingSpinner = false;
  lazyRows = 10;

  constructor(private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window,
              private pageService: PageService, private responsiveService: ResponsiveService, private productService: ProductService, private titleService: TitleService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pageName = 'collection/' + params.get('typeName');
      this.pageService.getPage(this.pageName);
      this.pageService.pageInfo$.filter(r => r[0] === this.pageName).map(r => r[1]).subscribe(res => {
          this.title = res.title;
          if (res && res['collection_id']) {
            this.productService.loadProducts(res['collection_id']);
          } else {
            this.products = [];
            this.collectionNameFa = '';
            this.productService.emptyFilters();
            console.error('-> ', `${this.pageName} is getting empty data for page`);
          }
        },
        err => {
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
    this.showHideSpinner(true);
    this.productService.productList$.subscribe(r => {
      this.products = r;
      this.sortedBy = {value: null};
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
    this.gridWidth = (this.curWidth - 20) / Math.floor(this.curWidth / 244) - 10;
    this.gridHeight = this.gridWidth + 90;
    this.lazyRows = this.isMobile ? 10 :
      Math.floor(this.gridwall.nativeElement.offsetWidth / 242)
      * Math.floor((this.window.innerHeight - 105) / 348) * 2;
    setTimeout(() => this.calcAfterScroll(), 1000);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scroll$.next();
  }

  calcAfterScroll() {
    this.showHideSpinner(true);

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

    this.showHideSpinner(false);
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

  showHideSpinner(shouldShow = false) {
    this.showWaitingSpinner = shouldShow;
  }
}
