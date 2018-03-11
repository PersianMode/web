import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {GenDialogComponent} from '../gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../enum/dialog.components.enum';
import {AuthService} from '../../services/auth.service';
import {PageService} from '../../services/page.service';
import {WINDOW} from '../../services/window.service';
import {CartService} from '../../services/cart.service';
import {priceFormatter} from '../../lib/priceFormatter';

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

  constructor(public dialog: MatDialog, private authService: AuthService,
              private pageService: PageService, private router: Router,
              @Inject(WINDOW) private window, private cartService: CartService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data) => this.isLoggedIn = data,
      (err) => {
        console.error('Cannot subscribe on isLoggedIn: ', err);
        this.isLoggedIn = false;
      }
    );
    this.authService.isVerified.subscribe(
      (data) => this.isVerified = data,
      (err) => {
        console.error('Cannot subscribe on isVerified: ', err);
        this.isVerified = false;
      }
    );
    this.itemSubs = this.cartService.cartItems.subscribe(data => this.cartNumbers = priceFormatter(data.length));
    this.pageService.placement$.filter(r => r[0] === 'logos').map(r => r[1]).subscribe(data => {
      this.logos = [];
      data = data.sort((x, y) => x.info.column - y.info.column);
      data.forEach(r => {
        const obj = {
          brand: r.info.text,
          filename: r.info.imgUrl,
        };
        if (r.info.style) {
          ['width', 'height', 'top', 'right'].forEach(key => {
            if (r.info.style[key])
              obj[key] = r.info.style[key];
          });
        }
        this.logos.push(obj);
      });
    });
  }

  login() {
    this.authService.checkValidation(this.router.url)
      .then(() => {
        this.authService.isVerified.subscribe(
          (data) => {
            if (!data && this.window.innerWidth >= 960)
              this.dialog.open(GenDialogComponent, {
                width: '500px',
                data: {
                  componentName: this.dialogEnum.oauthOtherDetails,
                  extraData: {
                    status: 'verify',
                  }
                }
              });
          }
        );
      })
      .catch(err => {
        this.dialog.open(GenDialogComponent, {
          width: '500px',
          data: {
            componentName: this.dialogEnum.login,
          }
        });
      });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.itemSubs.unsubscribe();
  }
}
