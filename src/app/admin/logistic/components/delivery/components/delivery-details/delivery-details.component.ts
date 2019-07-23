import {Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent implements OnInit {
  isHubClerk = false;
  start_date = null;
  start_time = {
    m: null,
    h: null,
  };
  end_date = null;
  end_time = {
    m: null,
    h: null,
  };

  constructor(public dialogRef: MatDialogRef<DeliveryDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.isHubClerk = this.data.isHubClerk;
    this.data = this.data.deliveryItem;

    this.start_date = this.data.start ? this.data.start : null;
    this.start_time = {
      h: this.data.start ? +moment(this.data.start).format('HH') : null,
      m: this.data.start ? +moment(this.data.start).format('mm') : null,
    };
    this.end_date = this.data.end ? this.data.end : null;
    this.end_time = {
      h: this.data.end ? +moment(this.data.end).format('HH') : null,
      m: this.data.end ? +moment(this.data.end).format('mm') : null,
    };
  }

  getAddressPart(direction, part) {
    const cw = direction.toLowerCase() === 'from' ?
      (this.data.is_return ? 'customer' : 'warehouse') :
      (Object.keys(this.data.to.customer || {}).length ? 'customer' : 'warehouse');
    return this.data[direction][cw].address[part];
  }

  getDestinationName() {
    const tf = this.data.is_return ? 'from' : 'to';

    if (Object.keys(this.data[tf].customer || {}).length)
      return this.data[tf].customer.address.recipient_name + ' ' + this.data[tf].customer.address.recipient_surname;
    else
      return this.data[tf].warehouse.name;
  }

  getDestinationPhone() {
    const tf = this.data.is_return ? 'from' : 'to';

    if (Object.keys(this.data[tf].customer || {}).length)
      return this.data[tf].customer.address.recipient_mobile_no ? this.data[tf].customer.address.recipient_mobile_no : '';
    else
      return this.data[tf].warehouse.phone ? this.data[tf].warehouse.phone : '';
  }

  getFormattedDate(date) {
    if (!date)
      return '';
    return moment(date).format('YYYY-MM-DD');
  }

  getFormattedClock(date) {
    if (!date)
      return '';
    return moment(date).format('HH:mm:ss');
  }

  getMaxValidEndDate() {
    return this.data.min_end ? moment(this.data.min_end).format('YYYY-MM-DD') : '-';
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getProductColorName(data) {
    const foundColor = data.colors.find(el => el._id.toString() === data.product_color_id.toString());
    return foundColor ? foundColor.name : '';
  }
}
