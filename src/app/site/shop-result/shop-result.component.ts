import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {dateFormatter} from '../../shared/lib/dateFormatter';
import {SpinnerService} from '../../shared/services/spinner.service';

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
              private httpService: HttpService,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.enable();
    this.route.queryParams.subscribe(params => {
      this.bankReferData = {
        tref: params.tref,
        invoiceNumber: params.iN,
        invoiceDate: params.iD,
      };
    });
    return new Promise((resolve, reject) => {
      this.httpService.post('payResult', this.bankReferData)
        .subscribe(res => {
            this.resultObj = res.resultObj;
            this.jalali_date = dateFormatter(this.resultObj.invoiceDate[0]);
            this.persian_trefId = this.resultObj.transactionReferenceID[0].split('').map(ch => (+ch).toLocaleString('fa')).join('');
            this.spinnerService.disable();
          },
          err => {
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
