import {Component, OnInit, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {PageService} from '../../services/page.service';
import {HttpService} from '../../services/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DictionaryService} from '../../services/dictionary.service';

@Component({
  selector: 'app-collection-header',
  templateUrl: './collection-header.component.html',
  styleUrls: ['./collection-header.component.css']
})
export class CollectionHeaderComponent implements OnInit {
  hiddenGenderMenu = true;
  selected = {
    men: false,
    women: false,
    boys: false,
    girls: false,
  };
  persistedList = false;
  searchIsFocused = false;
  menu: any = {};
  placements: any = {};
  topMenu = [];
  searchPhrase = null;
  searchProductList = [];
  searchCollectionList = [];
  searchWaiting = false;

  constructor(private router: Router, private pageService: PageService,
              private httpService: HttpService, private sanitizer: DomSanitizer,
              private dictionaryService: DictionaryService) {
  }

  ngOnInit() {
    this.pageService.placement$.filter(r => r[0] === 'menu').map(r => r[1]).subscribe(
      data => {
        this.topMenu = data.filter(r => r.variable_name === 'topMenu');
        this.topMenu
          .sort((x, y) => x.info.column - y.info.column)
          .forEach(r => {
            r.routerLink = ['/'].concat(r.info.href.split('/'));
            r.type = r.info.section ? r.info.section : r.routerLink[2];
          });
        const subMenu = data.filter(r => r.variable_name === 'subMenu');
        const sections = Array.from(new Set(subMenu.map(r => r.info.section)));
        this.placements = {};
        sections.forEach(s => {
          subMenu
            .filter(r => r.info.section === s)
            .sort((x, y) => (x.info.column * 100 + x.info.row) - (y.info.column * 100 + y.info.row))
            .forEach(r => {
              const path = r.info.section.split('/');
              r.info.routerLink = ['/'].concat(r.info.href.split('/'));
              if (!this.placements[path[0] + 'Menu']) {
                this.placements[path[0] + 'Menu'] = {};
              }
              if (!this.placements[path[0] + 'Menu'][path[1] + 'List']) {
                this.placements[path[0] + 'Menu'][path[1] + 'List'] = {};
              }
              if (!this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column])
                this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column] = [];

              this.placements[path[0] + 'Menu'][path[1] + 'List'][r.info.column].push(r.info);
            });
        });
      });
  }

  showList(type) {
    setTimeout(() => {
      this.searchUnfocused();
      this.hiddenGenderMenu = false;
      this.selected[type] = true;
      this.menu = this.placements[type + 'Menu'];
    }, 100);
  }

  countDownHideList() {
    setTimeout(() => {
      if (!this.persistedList) {
        this.hideList();
      }
    }, 100);
  }

  persistList() {
    this.persistedList = true;
  }

  hideList() {
    this.hiddenGenderMenu = true;
    this.persistedList = false;
    for (const i in this.selected) {
      if (this.selected.hasOwnProperty(i)) {
        this.selected[i] = false;
      }
    }
  }

  goToRoot() {
    this.router.navigate(['']);
  }

  getKeyList(list) {
    return Object.keys(list);
  }

  searchFocused() {
    this.searchIsFocused = true;
    if (this.searchPhrase)
      this.searchProduct();
    else {
      this.searchProductList = [];
      this.searchCollectionList = [];
    }
  }

  searchUnfocused() {
    this.searchIsFocused = false;
    this.searchProductList = [];
    this.searchCollectionList = [];
  }

  searchProduct() {
    this.searchProductList = [];
    if (!this.searchPhrase) {
      this.searchProductList = [];
      return;
    }

    this.searchWaiting = true;
    this.httpService.post('search/Product', {
      options: {
        phrase: this.searchPhrase,
      },
      offset: 0,
      limit: 5,
    }).subscribe(
      (data) => {
        this.searchProductList = [];
        if (data.data) {
          data.data.forEach(el => {
            this.searchProductList.push({
              id: el._id,
              name: el.name,
              brand: this.dictionaryService.translateWord(el.brand.name),
              type: this.dictionaryService.translateWord(el.product_type.name),
              imgUrl: this.getProductThumbnail(el),
              tags: this.dictionaryService.translateWord(el.tags.name),
              instances: el.instances.article_no,
              title: {
                name: 'Product',
                value: 'محصول',
              }
            });
          });
        }
        this.searchCollection();
      },
      (err) => {
        console.error('Cannot get search data: ', err);
        this.searchWaiting = false;
      });
  }

  searchCollection() {
    this.searchCollectionList = [];
    if (!this.searchPhrase) {
      this.searchCollectionList = [];
      return;
    }
    this.httpService.post('search/Collection', {
      options: {
        phrase: this.searchPhrase,
      },
      offset: 0,
      limit: 5,
    }).subscribe(
      (data) => {
        if (data.data) {
          data.data.forEach(el => {
            this.searchCollectionList.push({
              id: el._id,
              name: el.name,
              name_fa: el.name_fa,
              title: {
                name: 'Collection',
                value: 'کالکشن',
              }
            });
          });
        }
        this.searchCollectionList.forEach(el => {
          if (el.title.name === 'Collection')
            this.getCollectionPages(el);
        });
        this.searchWaiting = false;
      },
      (err) => {
        console.error('Cannot get search data: ', err);
        this.searchWaiting = false;
      });
  }

  getCollectionPages(el) {
    this.httpService.post('collectionPages', {
      collection_id: el.id,
    }).subscribe(
      (data) => {
        el.pages = data;
      },
      (err) => {
        console.error('Cannot get search data: ', err);
        this.searchWaiting = false;
      });
  }

  selectSearchResult(element) {
    if (element.title.name === 'Product')
      this.router.navigate([`/product/${element.id}`]);
    else
      this.router.navigate([`${element.pages[0].address}`]);

    this.searchIsFocused = false;
    this.searchProductList = [];
  }

  getProductThumbnail(product) {
    const img = (product.colors && product.colors.length) ?
      product.colors.filter(el => el.image && el.image.thumbnail) :
      null;
    return img && img.length ?
      this.sanitizer.bypassSecurityTrustResourceUrl([
        HttpService.Host,
        HttpService.PRODUCT_IMAGE_PATH,
        product._id,
        img[0]._id,
        img[0].image.thumbnail
      ].join('/')) :
      'assets/nike-brand.jpg';
  }

  @HostListener('document:click', ['$event'])
  public documentClick(e: any): void {
    if (!e.path.some(el => el.id === 'search-area'))
      this.searchUnfocused();
  }
}
