import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {priceFormatter} from '../../../shared/lib/priceFormatter';
import {PaymentType} from '../../../shared/enum/payment.type.enum';

@Component({
  selector: 'app-payment-type',
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.css']
})
export class PaymentTypeComponent implements OnInit {
  paymentType = PaymentType;
  @Output() selectedType = new EventEmitter();

  @Input()
  set balance(value) {
    this._balance = value ? value : 0;

    if (value && value > 0) {
      this.paymentTypes.find(el => el.value === this.paymentType.balance).disabled = false;
      this.paymentTypes.find(el => el.value === this.paymentType.balance).amount = value;
    } else {
      this.paymentTypes.find(el => el.value === this.paymentType.balance).disabled = true;
      this.paymentTypes.find(el => el.value === this.paymentType.balance).amount = 0;
    }
  }

  get balance() {
    return this._balance;
  }

  @Input()
  set loyaltyPoint(value) {
    this._loyaltyPoint = value ? value : 0;

    // if (value && value > 0) {
    //   this.paymentTypes.find(el => el.value === this.paymentType.loyaltyPoint).disabled = false;
    //   this.paymentTypes.find(el => el.value === this.paymentType.loyaltyPoint).amount = value;
    // } else {
    //   this.paymentTypes.find(el => el.value === this.paymentType.loyaltyPoint).disabled = true;
    //   this.paymentTypes.find(el => el.value === this.paymentType.loyaltyPoint).amount = 0;
    // }
  }

  get loyaltyPoint() {
    return this._loyaltyPoint;
  }

  private _balance = 0;
  private _loyaltyPoint = 0;
  paymentTypes: any[] = [
    {
      name: 'نقدی',
      value: this.paymentType.cash,
      disabled: false,
      amount: null,
    },
    {
      name: 'موجودی',
      value: this.paymentType.balance,
      disabled: true,
      amount: 0,
    },
    // {
    //   name: 'امتیاز',
    //   value: this.paymentType.loyaltyPoint,
    //   disabled: true,
    //   amount: 0,
    // }
  ];
  // selectedPaymentType: any = this.paymentTypes[0].value;
  selectedPaymentType: any = null;

  constructor() {
  }

  ngOnInit() {
    // this.selectedType.emit(this.selectedPaymentType);
  }

  paymentTypeChanged() {
    this.selectedType.emit(this.selectedPaymentType);
  }

  priceFormatter(p) {
    return priceFormatter(p);
  }
}
