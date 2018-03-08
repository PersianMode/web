import {Component, Input, OnInit} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input() private subTotal = 300000;
  @Input() private total = 100000;
  @Input() private discount = 20000;
  @Input() private balance = 20000;
  @Input() private loyalty = 15;
  subTotalValue: any;
  discountValue: any;
  balanceValue: any;
  totalPrice: any;
  loyaltyPoint: any;

  constructor() {
  }

  ngOnInit() {
    this.totalPrice = priceFormatter(this.total);
    this.subTotalValue = priceFormatter(this.subTotal);
    this.discountValue = priceFormatter(this.discount);
    this.balanceValue = priceFormatter(this.balance);
    this.loyaltyPoint = (+this.loyalty).toLocaleString('fa');


  }

}
