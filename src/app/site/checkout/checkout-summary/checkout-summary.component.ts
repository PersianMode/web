import {Component, Input, OnInit} from '@angular/core';
import {priceFormatter} from '../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-checkout-summary',
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.css']
})
export class CheckoutSummaryComponent implements OnInit {

  @Input() noDuration;

  @Input()
  set showCostLabel(value) {
    this._showCostLabel = value;
    if (!value) {
      this.finalTotal = this.total;
    } else {
      this.finalTotal = this.total + this.deliveryCost - this.deliveryDiscount;
    }
  }

  get showCostLabel() {
    return this._showCostLabel;
  }


  @Input()
  set deliveryCost(value) {
    this._deliveryCost = value;
    if (value) {
      this.finalTotal = this.total + value;
    }
  }

  get deliveryCost() {
    return this._deliveryCost;
  }

  @Input()
  set deliveryDiscount(value) {
    if (!value)
      value = 0;

    this._deliveryDiscount = value;
    this.finalTotal = this.total + this.deliveryCost - value;
  }

  get deliveryDiscount() {
    return this._deliveryDiscount;
  }

  @Input()
  set total(value) {
    this._total = value;
    if (value) {
      this.finalTotal = value - this.discount;
    }
  }

  get total() {
    return this._total;
  }

  @Input()
  set discount(value) {
    if (!value)
      value = 0;

    this._discount = value;
    this.finalTotal = this.total ? this.total - value : 0;
  }

  get discount() {
    return this._discount;
  }

  @Input()
  set usedBalance(value) {
    this._usedBalance = value;
    this.finalTotal = this.total - this.discount - this.usedLoyaltyPoint - this._usedBalance;
  }

  get usedBalance() {
    return this._usedBalance;
  }

  @Input()
  set usedLoyaltyPoint(value) {
    this._usedLoyaltyPoint = value;
    this.finalTotal = this.total - this.discount - this.usedLoyaltyPoint - this._usedBalance;
  }

  get usedLoyaltyPoint() {
    return this._usedLoyaltyPoint;
  }


  private _total = 0;
  private _discount = 0;
  private _usedBalance = 0;
  private _usedLoyaltyPoint = 0;
  private _deliveryCost = 0;
  private _deliveryDiscount = 0;
  private _showCostLabel = true;
  finalTotal = 0;
  @Input() earnedLoyaltyPoint;
  @Input() showEarnPointLabel;
  constructor() {
  }

  ngOnInit() {
    this.showCostLabel = true;
    this.deliveryCost = 0;
    this.deliveryDiscount = 0;
    this.earnedLoyaltyPoint = 0;
  }

  priceFormatter(p) {
    return priceFormatter(p);
  }
}
