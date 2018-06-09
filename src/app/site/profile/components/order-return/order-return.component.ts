import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { HttpService } from 'app/shared/services/http.service';
import {STATUS} from '../../../../shared/enum/status.enum';

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
  constructor(private dialogRef: MatDialogRef<OrderReturnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.get('warehouse/hup').subscribe(res => {
      this.ticket.status = STATUS.Return;
      this.ticket.receiver_id = res._id;
    });
  }

  cancelReturnOrder() {
    this.dialogRef.close();
  }

  addressSelected(address) {
    this.addressObject = address;
  }

  setReturnOrder() {
    this.ticket.desc.addressId = this.addressObject._id;
    this.ticket.desc.periodTime = this.timeReturn;
    this.ticket.desc.periodDay =  moment(this.dateObject, 'jYYYY/jM/jD').format('YYYY-M-D');
    console.log(this.ticket);
  }

}