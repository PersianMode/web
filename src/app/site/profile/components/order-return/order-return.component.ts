import {Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import {HttpService} from 'app/shared/services/http.service';
import {Location} from '@angular/common';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {ResponsiveService} from '../../../../shared/services/responsive.service';

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

  constructor(private httpService: HttpService, private location: Location,
              private snackBar: MatSnackBar,
              private progressService: ProgressService,
              private profileOrderService: ProfileOrderService, private dialogRef: MatDialogRef<OrderReturnComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any, private responsiveService: ResponsiveService) {
  }

  ngOnInit() {
    console.log('data:', this.data);
    this.order = this.data;
    this.orderLine = this.data.orderLines;
  }

  cancelReturnOrder() {
    if (this.responsiveService.isMobile) {
      this.location.back();
    } else {
      this.dialogRef.close(true);
    }

  }

  addressSelected(address) {
    this.addressObject = address;
  }

  setReturnOrder() {
    this.ticket.desc.address_id = this.addressObject._id;
    this.progressService.enable();
    this.httpService.post('order/return', {orderId: this.order._id, desc: this.ticket.desc}).subscribe(
      data => {
        this.snackBar.open('عملیات با موفقیت انجام گردید.', null, {
          duration: 2000,
        });

        if (this.responsiveService.isMobile) {
          this.location.back();
        } else {
          this.dialogRef.close(true);
        }
        this.progressService.disable();
      },
    );
  }

  // changeOrderLine(ol) {
  //   const updateOrderLines = [];
  //   this.profileOrderService.orderData.order.dialog_order.order_lines.forEach(el => {
  //     if (el.order_line_id === ol._id) {
  //       updateOrderLines.push(el);
  //     } else updateOrderLines.push(el);
  //   });
  //   this.profileOrderService.orderData.order.dialog_order.order_lines = updateOrderLines;
  // }

}
