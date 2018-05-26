import {Component, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {WINDOW} from '../../services/window.service';
import {CartService} from '../../services/cart.service';
import {PageService} from '../../services/page.service';
import {DictionaryService} from '../../services/dictionary.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpService} from '../../services/http.service';
import {ResponsiveService} from '../../services/responsive.service';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.css']
})
export class MobileHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sideNav;
  @Input() menuWidth = 100;
  @Input() menuHeight = 100;

  isLoggedIn = false;
  isVerified = false;
  sideNavIsOpen = false;
  isFirstLevel = true;
  isSecondLevel = false;
  isThirdLevel = false;
  firstLevelSelected = null;
  secondLevelSelected = null;
  secondLevelTitle = null;
  thirdLevelTitle = null;

  menuItems: any = {};
  display_name;
  cartNumbers = '';
  itemSubs;
  is_searching = false;
  searchIsFocused = false;
  searchPhrase = null;
  searchProductList = [];
  searchCollectionList = [];
  searchWaiting = false;
  curHeight;

  constructor(private authService: AuthService, private router: Router,
    @Inject(WINDOW) private window, private cartService: CartService, private pageService: PageService,
              private httpService: HttpService, private sanitizer: DomSanitizer,
              private dictionaryService: DictionaryService, private responsiveService: ResponsiveService) {
  }

  ngOnInit() {
    this.curHeight = this.responsiveService.curHeight;
    this.authService.isLoggedIn.subscribe(
      (data) => {
        this.isLoggedIn = this.authService.userIsLoggedIn();
        this.display_name = this.authService.userDetails.displayName;
      },
      (err) => {
        console.error('Cannot subscribe to isloggedIn: ', err);
      });
    this.authService.isVerified.subscribe(
      (data) => this.isVerified = data,
      (err) => console.error('Cannot subscribe to isVerified: ', err)
    );
    this.itemSubs = this.cartService.cartItems.subscribe(
      data => {
        data = data.length > 0 ? data.map(el => el.quantity).reduce((a, b) => +a + +b, 0) : 0;
        if (data)
          this.cartNumbers = data.toLocaleString('fa', {useGrouping: false})
        else
          this.cartNumbers = '';
      }
    );
    this.pageService.placement$.filter(r => r[0] === 'menu').map(r => r[1]).subscribe(
      data => {
        this.menuItems = {};
        const sectionMenu = {};
        if (data) {
          const topMenu = data.filter(r => r.variable_name === 'topMenu');
          topMenu.forEach(r => {
            const routerLink = ['/'].concat(r.info.href.split('/'));
            this.menuItems[r.info.text] = {
              menu: {},
            };
            this.menuItems[r.info.text].menu['همه ' + r.info.text] = {routerLink};
            const section = r.info.section ? r.info.section : routerLink[2];
            sectionMenu[section] = this.menuItems[r.info.text];
          });
          const subMenu = data.filter(r => r.variable_name === 'subMenu');
          let sub = '';
          subMenu.filter(r => r.info.section.split('/')[1] !== 'header')
            .map(r => Object.assign(r, {order: r.info.column * 100 + r.info.row + (r.info.section.split('/')[1] === 'left' ? 10000 : 0)}))
            .sort((x, y) => x.order - y.order)
            .forEach(r => {
              const routerLink = ['/'].concat(r.info.href.split('/'));
              const section = r.info.section.split('/')[0];
              if (!sub || r.info.row === 1 || r.info.isHeader) {
                sub = r.info.text;
                sectionMenu[section].menu[sub] = {
                  menu: {},
                };
                sectionMenu[section].menu[sub].menu['همه ' + r.info.text] = {routerLink};
              } else {
                sectionMenu[section].menu[sub].menu[r.info.text] = {routerLink};
              }
            });
          subMenu.filter(r => r.info.section.split('/')[1] === 'header')
            .sort((x, y) => x.row - y.row)
            .forEach(r => {
              const routerLink = ['/'].concat(r.info.href.split('/'));
              sectionMenu[r.info.section.split('/')[0]].menu[r.info.text] = {
                routerLink
              };
            });
          Object.assign(this.menuItems, {
            'خدمات': {
              is_title: true,
            },
            'راهنما': {
              routerLink: ['/', 'help'],
            },
            'تماس با ما': {
              routerLink: ['/', 'contact-us'],
            },
          });
        }
      });
    this.display_name = this.authService.userDetails.displayName;
  }

  getKeys(object) {
    const temp = object ? Object.keys(object) : [];
    return temp;
  }

  select(targetLevel, object, title) {
    if (!object || !object.hasOwnProperty('url')) {
      if (targetLevel === 1) {
        this.isFirstLevel = true;
        this.isSecondLevel = false;
        this.isThirdLevel = false;
      } else if (targetLevel === 2) {
        this.isFirstLevel = false;
        this.isSecondLevel = true;
        this.isThirdLevel = false;
        this.firstLevelSelected = object.menu;
        this.secondLevelTitle = title;
      } else if (targetLevel === 3) {
        this.isFirstLevel = false;
        this.isSecondLevel = false;
        this.isThirdLevel = true;
        this.secondLevelSelected = object.menu;
        this.thirdLevelTitle = title;
      }
    } else {
      // Redirect to specific url
      this.router.navigate([object.url]);
      this.sideNav.close();
    }
  }

  back(targetLevel) {
    if (targetLevel === 1) {
      this.isFirstLevel = true;
      this.isSecondLevel = false;
      this.isThirdLevel = false;
    } else if (targetLevel === 2) {
      this.isFirstLevel = false;
      this.isSecondLevel = true;
      this.isThirdLevel = false;
    } else if (targetLevel === 3) {
      this.isFirstLevel = false;
      this.isSecondLevel = false;
      this.isThirdLevel = true;
    }
  }

  backDropClick(data) {
    this.isFirstLevel = true;
    this.isSecondLevel = false;
    this.isThirdLevel = false;
    this.sideNav.toggle();
  }

  authentication() {
    this.authService.checkValidation(this.router.url)
      .then(() => {
        this.authService.isVerified.subscribe(
          (data) => {
            if (!data && this.window.innerWidth < 960)
              this.router.navigate(['login/oauth/other/verify']);
          }
        );
      })
      .catch(err => {
        this.router.navigate(['login']);
      });

    this.sideNav.close();
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
    this.is_searching = true;
    this.searchProductList = [];
    if (!this.searchPhrase) {
      this.searchCollectionList = [];
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
      this.searchProductList = [];
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
    this.searchIsFocused = false;
    this.searchProductList = [];
    this.searchCollectionList = [];
    if (isProduct) {
      this.router.navigate([`/product/${element.id}`]);
    } else if (!isProduct) {
      this.router.navigate([`${element.pages[0].address}`]);
    }
    this.is_searching = false;
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

  closeSearch() {
    this.is_searching = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['home']);
    this.sideNav.close();
  }

  ngOnDestroy() {
    this.itemSubs.unsubscribe();
  }

  navigate(arr) {
    this.router.navigate(arr);
    this.sideNavIsOpen = false;
  }

  navigateToProfile() {
    this.router.navigate(['/', 'profile']);
    this.sideNavIsOpen = false;
  }
}

