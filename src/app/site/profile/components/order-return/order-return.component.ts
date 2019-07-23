import {Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import {HttpService} from 'app/shared/services/http.service';
import {Location} from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ProgressService} from '../../../../shared/services/progress.service';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {ProfileOrderService} from 'app/shared/services/profile-order.service';


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
  addressObject;

  constructor(private httpService: HttpService, private location: Location,
    private snackBar: MatSnackBar,
    private progressService: ProgressService,
    private dialogRef: MatDialogRef<OrderReturnComponent>,
    private profileOrderService: ProfileOrderService,
    @Inject(MAT_DIALOG_DATA) private data: any, private responsiveService: ResponsiveService) {
  }

  ngOnInit() {
    this.order = this.data.order;
    this.orderLine = this.data.orderLine;
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
    if (!this.order) {
      this.snackBar.open('سفارش مشخص نیست', null, {
        duration: 2000,
      });
      return;
    }
    this.progressService.enable();
    this.httpService.post('order/return', {
      orderId: this.order._id,
      orderLineId: this.orderLine ? this.orderLine.order_line_id : null,
      addressId: this.addressObject._id
    }).subscribe(
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
        this.profileOrderService.getAllOrders();
       
      }
      , err => {
        this.snackBar.open('خطا به هنگام درخواست بازگشت سفارش.', null, {
          duration: 2000,
        });
        if (this.responsiveService.isMobile) {
          this.location.back();
        } else {
          this.dialogRef.close(true);
        }
        this.progressService.disable();

      });
  }


}
