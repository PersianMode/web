import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {priceFormatter} from '../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-checkout-summary',
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.css']
})
export class CheckoutSummaryComponent implements OnInit {

  @Input() noDuration;
  // ignoreDeliveryItems = false;

  @Output() onFinalTotalChange = new EventEmitter();

  private _total = 0;
  private _discount = 0;
  private _balanceValue = 0;
  private _maxLoyaltyDiscount = 0;
  private _deliveryCost = 0;
  private _deliveryDiscount = 0;
  private _useBalance = false;
  private _showDeliveryCostLabel = true;

  @Input()
  set showDeliveryCostLabel(value) {
    this._showDeliveryCostLabel = value;
    // this.ignoreDeliveryItems = !!!value;

    this.calculateFinalTotal();
  }

  get showDeliveryCostLabel() {
    return this._showDeliveryCostLabel;
  }

  loyaltyDiscount = 0;

  finalTotal = 0;

  modifiedBalance = 0;

  @Input()
  set useBalance(value) {
    this._useBalance = value;
    this.calculateFinalTotal();
  }

  get useBalance() {
    return this._useBalance;
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

  get discount() {
    return this._discount;
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

  get balanceValue() {
    return this._balanceValue;
  }

  @Input()
  set discount(value) {
    if (!value)
      value = 0;

    this._discount = value;
    this.calculateFinalTotal();
  }

  @Input()
  set balanceValue(value) {
    if (value) {
      this._balanceValue = value;
    }
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
    // this.finalTotal = this.total + (this.ignoreDeliveryItems ? 0 : (this.deliveryCost - this.deliveryDiscount)) - this.discount;
    if (this.showDeliveryCostLabel) {
      this.finalTotal = this.total + this.deliveryCost - this.deliveryDiscount - this.discount;
    } else {
      this.finalTotal = this.total - this.discount;
    }
    this.modifiedBalance = this.balanceValue;

    // !this.useBalance
    // const x = this.finalTotal;
    //
    // // if (this.useBalance && this.showDeliveryCostLabel)
    // const y = (this.finalTotal < this.modifiedBalance ? 0 : (this.finalTotal - this.modifiedBalance));
    //
    // // if (this.useBalance && !this.showDeliveryCostLabel)
    // const z = (this.finalTotal < this.modifiedBalance ? 0 : (this.finalTotal - this.modifiedBalance));


    if (!this.maxLoyaltyDiscount)
      this.loyaltyDiscount = 0;

    if (this.finalTotal && this.maxLoyaltyDiscount) {
      if (this.finalTotal >= this.maxLoyaltyDiscount) {
        this.loyaltyDiscount = this.maxLoyaltyDiscount;
        this.finalTotal -= this.loyaltyDiscount;
      } else {
        this.loyaltyDiscount = this.finalTotal;
        this.finalTotal = 0;
      }
    }

    if (this.finalTotal <= 0) {
      this.finalTotal = 0;
      this.onFinalTotalChange.emit(this.finalTotal);
      return;
    }

    // // if !withDelivery
    // const x = (this.total - this.discount) > this.balanceValue ? 0 : (this.balanceValue - (this.total - this.discount));
    // // if withDelivery
    // const y = (this.total + this.deliveryCost - this.deliveryDiscount - this.discount) > this.balanceValue ? 0
    //   : (this.balanceValue - (this.total + this.deliveryCost - this.deliveryDiscount - this.discount));

    if (this.useBalance) {
      if (this.finalTotal >= this.modifiedBalance) {
        this.modifiedBalance = 0;
        this.finalTotal -= this.modifiedBalance;
      } else {
        this.modifiedBalance -= this.finalTotal;
        this.finalTotal = 0;
      }

      if (this.finalTotal <= 0)
        this.finalTotal = 0;
    }
    this.onFinalTotalChange.emit(this.finalTotal);
  }

  ngOnInit() {
    this.showDeliveryCostLabel = true;
    this.deliveryCost = 0;
    this.deliveryDiscount = 0;
  }


  priceFormatter(p) {
    return priceFormatter(p);
  }
}
