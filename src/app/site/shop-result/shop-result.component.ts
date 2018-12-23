import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {HttpClient} from '@angular/common/http';
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
  spinnerEnabled = true;

  constructor(private router: Router, private route: ActivatedRoute,
              private httpService: HttpService,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.enable();
    this.route.queryParams.subscribe(params => {
      this.bankReferData = params;
    });
    const shopData = {
      merchantCode: 4480470,
      terminalCode: 1660557,
      tref: this.bankReferData.tref,
      invoiceNumber: this.bankReferData.iN,
      invoiceDate: this.bankReferData.iD,
    };
    return new Promise((resolve, reject) => {
      this.httpService.post('payResult', shopData)
        .subscribe(res => {
            this.resultObj = res.resultObj;
            this.jalali_date = dateFormatter(this.resultObj.invoiceDate[0]);
            this.spinnerService.disable();
            this.spinnerEnabled = false;
            resolve(res);
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
