import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {ProgressService} from '../../shared/services/progress.service';
import {AccessLevel} from '../../shared/enum/accessLevel.enum';
import {links} from '../../shared/lib/links';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  navLinks = [
    {label: 'کلکسیون‌ها', path: '/agent/collections', active: false},
    {label: 'محصولات', path: '/agent/products', active: false},
    {label: 'صفحه‌ها', path: '/agent/pages', active: false},
    {label: 'دیکشنری ', path: '/agent/dictionary', active: false},
    {label: 'بارگذاری فایل', path: '/agent/uploads', active: false},
    {label: 'سفارش ها', path: '/agent/orders', active: false},
  ];
  selectedLink = 'Collection';
  isLoggedIn = false;
  showProgressing = false;
  color: any = 'primary';
  mode: any;
  value: any;
  bufferValue: any;
  btnLabel = null;
  constructor(private authService: AuthService, private router: Router,
              private progressService: ProgressService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data: any) => {
        this.isLoggedIn = this.authService.userIsLoggedIn();
        this.btnLabel = data ? this.authService.userDetails.displayName : 'Logout';

        this.navLinks.forEach(link => {
          const foundLink = links.find(x => x.address === link.path);
          link.active = this.authService.userDetails.accessLevel === foundLink.access;
        });

      }
    );

    this.progressService.showProgress.subscribe(
      (data) => this.showProgressing = data,
      (err) => {
        this.showProgressing = false;
        console.error('An error occurred when subscribing on showProgress in progressService: ', err);
      }
    );

    this.progressService.progressMode.subscribe(
      (data) => this.mode = data,
      (err) => {
        this.mode = null;
        console.error('An error occurred when subscribing on progressMode in progressService: ', err);
      }
    );

    this.progressService.progressValue.subscribe(
      (data) => this.value = data,
      (err) => {
        this.value = null;
        console.error('An error occurred when subscribing on progressValue in progressService: ', err);
      }
    );

    this.progressService.progressBufferValue.subscribe(
      (data) => this.bufferValue = data,
      (err) => {
        this.bufferValue = null;
        console.error('An error occurred when subscribing on progressBufferValue in progressService: ', err);
      }
    );
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['agent/login']);
      })
      .catch();
  }
}
