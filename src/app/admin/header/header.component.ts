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
    {label: 'کالکشن‌ها', path: '/agent/collections', active: false},
    {label: 'محصولات', path: '/agent/products', active: false},
    {label: 'کمپین‌ها', path: '/agent/campaigns', active: false},
    {label: 'صفحه‌ها', path: '/agent/pages', active: false},
    {label: 'دیکشنری ', path: '/agent/dictionary', active: false},
    {label: 'محصولات تمام شده ', path: '/agent/soldouts', active: false},
    {label: 'بارگذاری فایل', path: '/agent/uploads', active: false},
    {label: 'سفارش‌ها', path: '/agent/orders', active: false},
    {label: 'تنظیمات هزینه ارسال', path: '/agent/deliverycost', active: false},
    {label: 'گروه وفاداری', path: '/agent/loyaltygroup', active: false},
    {label: 'ارسال', path: '/agent/delivery', active: false},
    {label: 'اولویت ارسال',path:'/agent/deliverypriority',active:false },
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
          link.active = foundLink.access.find(x => x === this.authService.userDetails.accessLevel) >= 0;
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
