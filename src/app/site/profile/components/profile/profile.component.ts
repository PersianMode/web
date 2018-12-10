import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {TitleService} from '../../../../shared/services/title.service';
import {CheckoutService} from '../../../../shared/services/checkout.service';
import {MatDialog} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  headerTitle;
  balance;
  active;
  disabled = false;

  constructor(private authService: AuthService, private checkoutService: CheckoutService,
              private router: Router, private profileOrderService: ProfileOrderService, private titleService: TitleService,
              private httpService: HttpService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.filter(r => r).subscribe(() => { // on logout
      if (!this.authService.userIsLoggedIn())
        this.router.navigate(['/']);
      else
        this.titleService.setTitleWithConstant('پروفایل');
    });
    this.checkoutService.getCustomerAddresses();
  }

  setHeaderTitle(title) {
    this.headerTitle = title;
  }
}

