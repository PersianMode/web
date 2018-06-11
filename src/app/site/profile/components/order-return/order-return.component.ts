import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from 'app/shared/services/http.service';
import { Location } from '@angular/common';
import { ProfileOrderService } from '../../../../shared/services/profile-order.service';
import { MatSnackBar } from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';


export interface ITicket {
  desc: {
    day: {
      time_slot: string,
      day_slot: string
    },
    address_id: string
  }
}
@Component({
  selector: 'app-order-return',
  templateUrl: './order-return.component.html',
  styleUrls: ['./order-return.component.css']
})

export class OrderReturnComponent implements OnInit {
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();

  order: any;
  orderLine: any;
  ticket: ITicket = {
    desc: {
      day: {
        time_slot: '',
        day_slot: ''
      },
      address_id: ''
    }
  };
  addressObject;
  dateObject;
  timeReturn: string;
  constructor( private httpService: HttpService, private location: Location,
    private snackBar: MatSnackBar,
    private progressService: ProgressService,
    private profileOrderService: ProfileOrderService) { }

  ngOnInit() {
    this.order = {_id: this.profileOrderService.orderData.order.orderId};
    this.orderLine = {_id: this.profileOrderService.orderData.orderLine.order_line_id};
  }
  cancelReturnOrder() {
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
    this.ticket.desc.address_id = this.addressObject._id;
    this.ticket.desc.day.time_slot = this.timeReturn;
    this.ticket.desc.day.day_slot =  moment(this.dateObject, 'jYYYY/jM/jD').format('YYYY-M-D hh:mm:ss');
    this.progressService.enable();
    this.httpService.post('order/return', {order: this.order, orderLine: this.orderLine, desc: this.ticket.desc}).subscribe(
      data => {
        this.snackBar.open('عمیلات با موفقیت انجام گردید.', null, {
          duration: 2000,
        });
        if (this.isNotMobile) {
          this.closeDialog.emit(false);
        } else {
          this.location.back();
        }
      },
      errr => {
        this.snackBar.open('خطا در پایان کمپین. لطفا مجددا تلاش کنید', null, {
          duration: 2700
        });
        this.progressService.disable();
      }
    );
  }

}
