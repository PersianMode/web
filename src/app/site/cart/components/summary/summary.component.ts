import {Component, Input, OnInit} from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  // @Input() private subTotal;
  // @Input() private total;
  // @Input() private discount;
  // @Input() private balance;
  // @Input() private loyalty;
  loyalty = 30;
  balance = 20;
  subTotal = 55;
  discount = 35;
  total = 20;
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
