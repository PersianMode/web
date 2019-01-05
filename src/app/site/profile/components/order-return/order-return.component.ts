import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from 'app/shared/services/http.service';
import { Location } from '@angular/common';
import { ProfileOrderService } from '../../../../shared/services/profile-order.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';


export interface ITicket {
  desc: {
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
      address_id: ''
    }
  };
  addressObject;
  dateObject;
  timeReturn: string;
  constructor( private httpService: HttpService, private location: Location,
    private snackBar: MatSnackBar,
    private progressService: ProgressService,
    private profileOrderService: ProfileOrderService, private dialogRef: MatDialogRef<OrderReturnComponent>,
               @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    console.log('data:', this.data);
    this.order = this.data;
    this.orderLine =  this.data.orderLines;
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
    this.dialogRef.close(true);
    this.ticket.desc.address_id = this.addressObject._id;
    this.progressService.enable();
    this.httpService.post('order/return', {orderId: this.order._id, desc: this.ticket.desc}).subscribe(
      data => {
        this.snackBar.open('عملیات با موفقیت انجام گردید.', null, {
          duration: 2000,
        });
        // delete after server completed
        this.order.tickets[0].status = 8;
        ////
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
