import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {dateFormatter} from '../../shared/lib/dateFormatter';
import {SpinnerService} from '../../shared/services/spinner.service';
import {CartService} from '../../shared/services/cart.service';
import {CheckoutService} from '../../shared/services/checkout.service';

@Component({
  selector: 'app-shop-result',
  templateUrl: './shop-result.component.html',
  styleUrls: ['./shop-result.component.css']
})
export class ShopResultComponent implements OnInit {
  bankReferData: any = null;
  jalali_date = [];
  persian_trefId = '';
  payResult: any = null;
  verifyResult: any = null;


  constructor(private router: Router, private route: ActivatedRoute,
              private httpService: HttpService, private cartService: CartService,
              private spinnerService: SpinnerService, private checkoutService: CheckoutService) {
  }

  ngOnInit() {
    this.spinnerService.enable();
    this.cartService.loadCartsForShopRes();
    this.route.queryParams.subscribe(params => {
      this.bankReferData = {
        tref: params.tref,
        invoiceNumber: params.iN,
        invoiceDate: params.iD,
      };
    });
    // should final check and verify shop proccess if final check result is valid(no error , no warning)
    this.checkoutService.readPayResult(this.bankReferData)
      .then((res: any) => {
        console.log('Pay Result :', res);
        this.payResult = res.xmlToNodeReadRes;
        this.verifyResult = res.xmlToNodeVerifyRes ? res.xmlToNodeVerifyRes : null;
        if (this.payResult.result[0] === 'False') {
          this.spinnerService.disable();
          return Promise.reject('Unsuccessful/Return Shop');
        } else if (this.payResult.result[0] === 'True') {
          this.jalali_date = dateFormatter(this.payResult.invoiceDate[0]);
          this.persian_trefId = this.payResult.transactionReferenceID[0].split('').map(ch => (+ch).toLocaleString('fa')).join('');
          if (this.payResult.action[0] === '1003') {
            if (this.verifyResult.result[0] === 'True') {
              localStorage.removeItem('address');
              this.cartService.emptyCart();
              this.spinnerService.disable();
            } else if (this.verifyResult.result[0] === 'False') {
              this.cartService.loadCartsForShopRes();
              this.spinnerService.disable();
              return Promise.reject('Verify Failed');
            }
            // err => {
            //   this.resultObj = err.error.resultObj;
            //   return Promise.reject(err);
            // }

          }
        }
      })
      .catch(err => {
        this.payResult = err;
        console.log('ERR :', this.payResult);
        this.cartService.loadCartsForShopRes();
        this.spinnerService.disable();
      });
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }
}


