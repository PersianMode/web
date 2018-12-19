import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-shop-result',
  templateUrl: './shop-result.component.html',
  styleUrls: ['./shop-result.component.css']
})
export class ShopResultComponent implements OnInit {
  bankReferData: any = null;

  constructor(private router: Router, private route: ActivatedRoute,
              private httpService: HttpService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.bankReferData = params;
    });


    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://pep.shaparak.ir/CheckTransactionResult.aspx', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send(this.bankReferData.tref.toString());

    // return new Promise((resolve, reject) => {
    //   this.http.post('https://pep.shaparak.ir/CheckTransactionResult.aspx', this.bankReferData.tref, {
    //     headers: {
    //       'Content-Type': 'application/json; charset=UTF-8',
    //     }
    //   })
    //     .subscribe(
    //       (info: any) => {
    //         console.log(info);
    //       }, err => {
    //         console.log('err: ', err);
    //       }
    //     );
    // });
  }
}
