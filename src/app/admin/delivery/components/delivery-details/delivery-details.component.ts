import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent implements OnInit {
  deliveryAgentList = [];
  isHubClerk = false;
  newDeliveryAgentId = null;
  start_date = null;
  start_time = {
    m: null,
    h: null,
  };

  constructor(private dialogRef: MatDialogRef<DeliveryDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService, private dialog: MatDialog) {}

  ngOnInit() {
    this.deliveryAgentList = this.data.agentList;
    this.isHubClerk = this.data.isHubClerk;
    this.data = this.data.deliveryItem;

    console.log(moment(this.data.start).format('YYYY-MM-DD'));
    console.log(moment(this.data.start).format('hh'));
    console.log(moment(this.data.start).format('mm'));

    this.start_date = moment(this.data.start).format('YYYY-MM-DD');
    this.start_time = {
      h: +moment(this.data.start).format('hh'),
      m: +moment(this.data.start).format('mm'),
    };
  }

  closeDialog() {
    if (!this.noChanges()) {
      // ToDo: Should display confirmation on leave message to user
      console.log('Do you want leave without saving changes?');
      this.dialogRef.close();
    } else
      this.dialogRef.close();
  }

  hasDeliveryAgent() {
    return this.data.delivery_agent && Object.keys(this.data.delivery_agent).length;
  }

  getAddressPart(direction, part) {
    const cw = direction.toLowerCase() === 'from' ?
      (this.data.is_return ? 'customer' : 'warehouse') :
      (Object.keys(this.data.to.customer).length ? 'customer' : 'warehouse');
    return this.data[direction][cw].address[part];
  }

  deliveryAgentChange(data) {
    this.newDeliveryAgentId = data.value;
  }

  getCustomerDetails() {
    const tf = this.data.is_return ? 'from' : 'to';
    const name = this.data[tf].customer.address.recipient_name + ' ' + this.data[tf].customer.address.recipient_surname;
    return name + (this.data[tf].customer.address.recipient_mobile_no ? ' - ' + this.data[tf].customer.address.recipient_mobile_no : '');
  }

  saveChanges() {
    console.log('saved');
  }

  noChanges() {
    let noChange = true;

    if ((this.newDeliveryAgentId && this.newDeliveryAgentId !== this.data.delivery_agent._id) ||
      (!this.newDeliveryAgentId && this.data.delivery_agent._id))
      noChange = false;

    const sd = moment(this.data.start).format('YYYY-MM-DD');
    const st = {
      h: +moment(this.data.start).format('hh'),
      m: +moment(this.data.start).format('mm'),
    };

    if (this.data.start && (this.start_time.m !== st.m || this.start_time.h !== st.h))
      noChange = false;

    if (this.data.start && this.start_date !== sd)
      noChange = false;

    return noChange;
  }

  changeStartTime(part) {
    if (part === 'm') {
      if (this.start_time.m < 0)
        this.start_time.m = 0;
      else if (this.start_time.m > 59)
        this.start_time.m = 59;
    } else if (part === 'h') {
      if (this.start_time.h < 0)
        this.start_time.h = 0;
      else if (this.start_time.h > 23)
        this.start_time.h = 23;
    }
  }
}
