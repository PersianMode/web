import { Component, OnInit, Input } from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-loyalty-discount',
  templateUrl: './loyalty-discount.component.html',
  styleUrls: ['./loyalty-discount.component.css']
})
export class LoyaltyDiscountComponent implements OnInit {
  @Input() loyaltyLabel;
  loyaltyNameList;
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.get(`loyaltygroup`).subscribe(res => {
      this.loyaltyNameList = res;
    }, err => {
      console.error();
    });
    console.log('--------', this.loyaltyNameList);
  }
}
