import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {GenDialogComponent} from '../gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../enum/dialog.components.enum';
import {AuthService} from '../../services/auth.service';
import {PageService} from '../../services/page.service';
import {WINDOW} from '../../services/window.service';
import {CartService} from '../../services/cart.service';
import {CheckoutService} from '../../services/checkout.service'
import {LoginStatus} from '../../../site/login/login-status.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  logos = [];
  dialogEnum = DialogEnum;
  isLoggedIn = false;
  isVerified = false;
  cartNumbers = '';
  itemSubs;
  display_name;

  constructor(public dialog: MatDialog, private authService: AuthService,
              private pageService: PageService, private router: Router,
              private CheckoutService: CheckoutService,
              @Inject(WINDOW) private window, private cartService: CartService) {
  }

  ngOnInit() {
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
    this.CheckoutService.ccRecipientData=null;

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
