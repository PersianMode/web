import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { HttpService } from 'app/shared/services/http.service';
import {STATUS} from '../../../../shared/enum/status.enum';
import { Location } from '@angular/common';
import { ProfileOrderService } from '../../../../shared/services/profile-order.service';

export interface ITicket {
  receiver_id: string;
  status: number;
  desc: {
    periodTime: string,
    addressId: string,
    periodDay: string
  };
}
@Component({
  selector: 'app-order-return',
  templateUrl: './order-return.component.html',
  styleUrls: ['./order-return.component.css']
})

export class OrderReturnComponent implements OnInit {
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();

  orderObject: any;
  ticket: ITicket = {
    receiver_id: '',
    status: 14,
    desc: {
      periodTime: '',
      addressId: '',
      periodDay: ''
    }
  };
  addressObject;
  dateObject;
  timeReturn: string;
  returnTimes = [{value: '10-18', time: '10-18', checked: true}, {value: '18-22', time: '18-22', checked: false}];
  // private dialogRef: MatDialogRef<OrderReturnComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any,
  constructor( private httpService: HttpService,private location: Location, 
    private profileOrderService: ProfileOrderService) { }

  ngOnInit() {
    this.orderObject = this.profileOrderService.orderData;
    console.log(this.profileOrderService.orderData);
    this.httpService.get('warehouse/hup').subscribe(res => {
      this.ticket.status = STATUS.Return;
      this.ticket.receiver_id = res._id;
    });
  }
  cancelReturnOrder() {
    // TODO: guard is needed if any fields have been changed!
    if (this.isNotMobile) {
      this.closeDialog.emit(false);
    } else {
      this.location.back();
    }
  }


  addressSelected(address) {
    this.addressObject = address;
  }

  setReturnOrder() {
    this.ticket.desc.addressId = this.addressObject._id;
    this.ticket.desc.periodTime = this.timeReturn;
    this.ticket.desc.periodDay =  moment(this.dateObject, 'jYYYY/jM/jD').format('YYYY-M-D');
    console.log('ticket', this.ticket);
    console.log('Order', this.orderObject);
  }

}