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
    this.progressService.enable();
    this.httpService.post('order/return', {orderId: this.order._id, orderLineId: this.orderLine._id, desc: this.ticket.desc}).subscribe(
      data => {
        this.snackBar.open('عملیات با موفقیت انجام گردید.', null, {
          duration: 2000,
        });
        this.changeOrderLine(this.orderLine);
        if (this.isNotMobile) {
          this.closeDialog.emit(false);
        } else {
          this.location.back();
        }
        this.progressService.disable();
      },
    );
  }

  changeOrderLine(ol) {
    const updateOrderLines = [];
    this.profileOrderService.orderData.order.dialog_order.order_lines.forEach(el => {
      if (el.order_line_id === ol._id) {
        updateOrderLines.push(el);
      } else updateOrderLines.push(el);
    });
    this.profileOrderService.orderData.order.dialog_order.order_lines = updateOrderLines;
  }

}
