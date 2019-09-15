import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { priceFormatter } from '../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-checkout-summary',
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.css']
})
export class CheckoutSummaryComponent implements OnInit {

  @Input() noDuration;
  ignoreDeliveryItems = false;

  @Input()
  set showCostLabel(value) {
    this._showCostLabel = value;
    this.ignoreDeliveryItems = !value;

    this.calculateFinalTotal();
  }

  @Output() onFinalTotalChange = new EventEmitter();

  private _total = 0;
  private _discount = 0;
  private _balanceValue = 0;
  private _maxLoyaltyDiscount = 0;
  private _deliveryCost = 0;
  private _deliveryDiscount = 0;
  private _showCostLabel = true;


  loyaltyDiscount = 0;

  finalTotal = 0;

  ngOnInit() {
    this.showCostLabel = true;
    this.deliveryCost = 0;
    this.deliveryDiscount = 0;
  }



  get showCostLabel() {
    return this._showCostLabel;
  }

  @Input()
  set deliveryCost(value) {
    this._deliveryCost = value;
    if (value) {
      this.calculateFinalTotal();
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
    this.calculateFinalTotal();
  }

  get deliveryDiscount() {
    return this._deliveryDiscount;
  }

  @Input()
  set total(value) {
    this._total = value;
    if (value) {
      this.finalTotal = value;
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
    this.calculateFinalTotal();
  }

  get discount() {
    return this._discount;
  }


  @Input()
  set balanceValue(value) {
    if (value) {
      this._balanceValue = value;
    }
  }

  get balanceValue() {
    return this._balanceValue;
  }

  @Input()
  set maxLoyaltyDiscount(value) {
    this._maxLoyaltyDiscount = value;
    this.calculateFinalTotal();
  }

  get maxLoyaltyDiscount() {
    return this._maxLoyaltyDiscount;
  }

  calculateFinalTotal() {

    this.finalTotal = this.total + (this.ignoreDeliveryItems ? 0 : (this.deliveryCost - this.deliveryDiscount)) - this.balanceValue;

    if (this.finalTotal < 0)
      this.finalTotal = 0;

    if (!this.maxLoyaltyDiscount)
      this.loyaltyDiscount = 0;

    if (this.finalTotal && this.maxLoyaltyDiscount) {
      if (this.finalTotal >= this.maxLoyaltyDiscount) {
        this.loyaltyDiscount = this.maxLoyaltyDiscount;
        this.finalTotal -= this.loyaltyDiscount
      } else {
        this.loyaltyDiscount = this.finalTotal;
        this.finalTotal = 0;
      }
    }

    this.onFinalTotalChange.emit(this.finalTotal);
  }


  priceFormatter(p) {
    return priceFormatter(p);
  }
}
