import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {dateFormatter} from '../../shared/lib/dateFormatter';
import {SpinnerService} from '../../shared/services/spinner.service';
import {CartService} from '../../shared/services/cart.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-shop-result',
  templateUrl: './shop-result.component.html',
  styleUrls: ['./shop-result.component.css']
})
export class ShopResultComponent implements OnInit {
  bankReferData: any = null;
  resultObj: any = null;
  jalali_date = [];
  persian_trefId = '';

  constructor(private router: Router, private route: ActivatedRoute,
              private httpService: HttpService, private cartService: CartService,
              private spinnerService: SpinnerService, private authService: AuthService) {
  }

  ngOnInit() {
    const cartItems = null;
    this.spinnerService.enable();
    // this.cartService.loadCartsForShopRes();
    this.route.queryParams.subscribe(params => {
      this.bankReferData = {
        tref: params.tref,
        invoiceNumber: params.iN,
        invoiceDate: params.iD,
        cartItems: this.authService.userIsLoggedIn() ? {} : this.cartService.getCheckoutItems(),
      };
    });
    return new Promise((resolve, reject) => {
      console.log(cartItems);
      this.httpService.post('payResult', this.bankReferData)
        .subscribe(res => {
            this.resultObj = res.resultObj;
            if (this.resultObj.result[0] === 'True') {
              localStorage.removeItem('address');
              this.cartService.emptyCart();
            } else {
              this.cartService.loadCartsForShopRes();
            }
            this.jalali_date = dateFormatter(this.resultObj.invoiceDate[0]);
            this.persian_trefId = this.resultObj.transactionReferenceID[0].split('').map(ch => (+ch).toLocaleString('fa')).join('');
            this.spinnerService.disable();
          },
          err => {
            console.log('ERR : ', err);
            this.resultObj = err.error.resultObj;
            this.cartService.loadCartsForShopRes();
            this.spinnerService.disable();
            reject();
          });
    });
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }
}
