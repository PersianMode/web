import { Component, OnInit, Input } from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-loyalty-discount',
  templateUrl: './loyalty-discount.component.html',
  styleUrls: ['./loyalty-discount.component.css']
})
export class LoyaltyDiscountComponent implements OnInit {
  loyaltyNameList;
  loyaltyDiscountList = [];
  loyalty_label;
  @Input()
  set loyaltyLabel(value) {
    this.loyalty_label = value;
    if (this.loyaltyNameList && this.loyaltyNameList.length)
    this.loyaltyNameList.forEach(el => el.value = null);
  }
  constructor(private httpService: HttpService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.httpService.get('loyaltygroup').subscribe(
      data => {
        this.loyaltyNameList = data;
      },
      err => {
        console.error('Cannot get loyalty groups: ', err);
        this.snackBar.open('قادر به دریافت اطلاعات گروه های وفاداری نیستیم. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }


  submitDiscount() {
    this.loyaltyDiscountList = [];
    this.loyaltyNameList.forEach(el => {
      if (!this.loyaltyDiscountList.map(i => i.name).includes(el))
        this.loyaltyDiscountList.push(el);
    });
  }

}
