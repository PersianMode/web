import {Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {WINDOW} from '../../services/window.service';
import {CartService} from '../../services/cart.service';
import {priceFormatter} from '../../lib/priceFormatter';
import {PageService} from '../../services/page.service';

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

  cartNumbers = '';
  itemSubs;

  constructor(private authService: AuthService, private router: Router,
              @Inject(WINDOW) private window, private cartService: CartService, private pageService: PageService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data) => this.isLoggedIn = data,
      (err) => console.error('Cannot subscribe to isloggedIn: ', err)
    );
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
      });
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
      .catch(err => console.log(err));

    this.sideNav.close();
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
}

