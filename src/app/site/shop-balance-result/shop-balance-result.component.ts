import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {dateFormatter} from '../../shared/lib/dateFormatter';
import {SpinnerService} from '../../shared/services/spinner.service';
import {CartService} from '../../shared/services/cart.service';
import {CheckoutService} from '../../shared/services/checkout.service';

@Component({
  selector: 'app-shop-balance-result',
  templateUrl: './shop-balance-result.component.html',
  styleUrls: ['./shop-balance-result.component.css']
})
export class ShopBalanceResultComponent implements OnInit {
  jalali_date = [];
  payResult: any = null;


  constructor(private router: Router, private route: ActivatedRoute,
              private httpService: HttpService, private cartService: CartService,
              private spinnerService: SpinnerService, private checkoutService: CheckoutService) {
  }

  ngOnInit() {
    this.spinnerService.enable();
    this.cartService.loadCartsForShopRes();
    this.route.queryParams.subscribe(params => {
      console.log('***********', params);
      this.payResult = params;
    });
    this.jalali_date = dateFormatter(this.payResult.invoiceDate);
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }
}

