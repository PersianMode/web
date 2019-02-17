import {Component, OnInit, HostListener, Inject, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {PageService} from '../../services/page.service';
import {HttpService} from '../../services/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DictionaryService} from '../../services/dictionary.service';
import {GenDialogComponent} from '../gen-dialog/gen-dialog.component';
import {LoginStatus} from '../../../site/login/login-status.enum';
import {DialogEnum} from '../../enum/dialog.components.enum';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {CheckoutService} from '../../services/checkout.service';
import {WINDOW} from '../../services/window.service';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-collection-header',
  templateUrl: './collection-header.component.html',
  styleUrls: ['./collection-header.component.css']
})
export class CollectionHeaderComponent implements OnInit, OnDestroy {
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
  rows: any = [];
  logos = [];
  dialogEnum = DialogEnum;
  isLoggedIn = false;
  isVerified = false;
  cartNumbers = '';
  itemSubs;
  display_name;

  constructor(private router: Router, private pageService: PageService,
              private httpService: HttpService, private sanitizer: DomSanitizer,
              private dictionaryService: DictionaryService,
              public dialog: MatDialog, private authService: AuthService,
              private CheckoutService: CheckoutService,
              @Inject(WINDOW) private window, private cartService: CartService) {
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
    this.authService.isLoggedIn.subscribe(
      (data) => {
        this.isLoggedIn = this.authService.userIsLoggedIn();
        this.display_name = this.authService.userDetails.displayName;
      },
      (err) => {
        console.error('Cannot subscribe on isLoggedIn: ', err);
        this.isLoggedIn = false;
      });
    this.authService.isVerified.subscribe(
      (data) => this.isVerified = data,
      (err) => {
        console.error('Cannot subscribe on isVerified: ', err);
        this.isVerified = false;
      }
    );
    this.itemSubs = this.cartService.cartItems.subscribe(
      data => {
        data = data.length > 0 ? data.map(el => el.quantity).reduce((a, b) => (+a) + (+b)) : 0;
        if (+data) {
          this.cartNumbers = (+data).toLocaleString('fa', {useGrouping: false});
        } else {
          this.cartNumbers = '';
        }
      });
    this.pageService.placement$.filter(r => r[0] === 'logos').map(r => r[1]).subscribe(data => {
      this.logos = data && data.length ? data.sort((x, y) => x.info.column - y.info.column) : [];
    });
    this.display_name = this.authService.userDetails.displayName;
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
      this.searchCollectionList = [];
      return;
    }

    this.searchWaiting = true;
    this.httpService.post('search/Product', {
      options: {
        phrase: this.searchPhrase,
      },
      offset: 0,
      limit: 6,
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
              article_no: el.article_no,
            });
          });
        }
        this.alignRow();
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
      this.searchProductList = [];
      return;
    }
    this.httpService.post('search/Collection', {
      options: {
        phrase: this.searchPhrase,
      },
      offset: 0,
      limit: 6,
    }).subscribe(
      (data) => {
        this.searchCollectionList = [];
        if (data.data) {
          data.data.forEach(el => {
            this.searchCollectionList.push({
              id: el._id,
              name: el.name,
              name_fa: el.name_fa,
            });
          });
        }
        this.searchCollectionList.forEach(el => {
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

  selectSearchResult(element, isProduct) {
    if (isProduct)
      this.router.navigate([`/product/${element.id}`]);
    else
      this.router.navigate([`${element.pages[0].address}`]);

    this.searchIsFocused = false;
    this.searchProductList = [];
    this.searchCollectionList = [];
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

  alignRow() {
    if (this.searchProductList.length <= 0) {
      this.rows = [];
      return;
    }
    this.rows = [];
    let chunk = [], counter = 0;
    for (const sp in this.searchProductList) {
      if (this.searchProductList.hasOwnProperty(sp)) {
        chunk.push(this.searchProductList[sp]);
        counter++;

        if (counter >= 2) {
          counter = 0;
          this.rows.push(chunk);
          chunk = [];
        }
      }
    }
    if (counter > 0) {
      this.rows.push(chunk);
    }
  }

  onClose() {
    this.searchPhrase = null;
    this.searchProductList = [];
    this.searchCollectionList = [];
    this.searchWaiting = false;
    this.searchIsFocused = false;
  }

  @HostListener('document:click', ['$event'])
  public documentClick(e: any): void {
    if (!e.path.some(el => el.id === 'search-area'))
      this.searchUnfocused();
  }

  login() {
    this.authService.checkValidation(this.router.url)
      .then(() => {
        return new Promise((innerResolve, innerReject) => {
          this.authService.isVerified.subscribe(
            (data) => {
              if (!data) {
                return innerReject('header::authService->isVerified is false');
              }
            }
          );
        });
      })
      .catch(err => {
        this.dialog.open(GenDialogComponent, {
          width: '500px',
          data: {
            componentName: this.dialogEnum.login,
            extraData: {
              loginStatus: LoginStatus.Login
            }
          }
        });
      });
  }

  logout() {
    this.authService.logout();
    this.CheckoutService.ccRecipientData = null;

  }

  ngOnDestroy() {
    this.itemSubs.unsubscribe();
  }

  navigateToProfile() {
    this.router.navigate(['/', 'profile']);
  }

  navigateToCart() {
    this.router.navigate(['/', 'cart']);
  }
}
