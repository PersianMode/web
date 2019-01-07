import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Router} from '@angular/router';
import {dateFormatter} from '../../../../shared/lib/dateFormatter';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {ORDER_STATUS} from '../../../../shared/enum/status.enum';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {OrderStatuses} from '../../../../shared/lib/status';
import * as moment from 'moment';
import {OrderReturnComponent} from '../order-return/order-return.component';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  profileOrder = [];
  checkOrder;
  displayedColumns = ['col_no', 'date', 'order_lines', 'total_amount', 'discount', 'used_point', 'address', 'view_details', 'return_order'];
  isMobile = false;
  selectedOrder;
  orderInfo: any;
  returnOrderTime;
  expiredTime = false;
  @Output() closeDialog = new EventEmitter<boolean>();


  constructor(private profileOrderService: ProfileOrderService, private router: Router,
              private responsiveService: ResponsiveService,
              private dialog: MatDialog, protected httpService: HttpService,
              private snackBar: MatSnackBar,
              protected progressService: ProgressService) {
    this.isMobile = this.responsiveService.isMobile;
  }

  ngOnInit() {
    this.profileOrderService.orderArray.subscribe(result => {
      if (!result.length)
        return;
      this.profileOrder = result;
      this.orderInfo = result;
      this.profileOrder.forEach(el => [el.jalali_date, el.time] = dateFormatter(el.order_time));
    });
    this.isMobile = this.responsiveService.isMobile;
    this.profileOrderService.getAllOrders();
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
  }

  makePersianNumber(a: string, isPrice) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: isPrice});
  }

  goToOrderLines(orderId) {
    this.profileOrderService.getAllOrders();
    this.selectedOrder = {
      orderId: orderId,
      dialog_order: this.profileOrder.find(el => el._id === orderId),
    };
    this.profileOrderService.orderData = this.selectedOrder;
    if (this.responsiveService.isMobile) {
      this.router.navigate([`/profile/orderlines`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '700px',
        data: {
          componentName: DialogEnum.orderLinesComponent,
        }
      });
    }
  };

  ngOnDestroy() {
  };

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  showDialogCancelOrder(order) {
    let options: any = {
      orderId: order._id,
      orderLines: order.order_lines,
    };
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.post(`order/cancel`, options)
            .subscribe(
              data => {
                this.openSnackBar('کالای مورد نظر با موفقیت کنسل شد.');
                this.closeDialog.emit(false);
                this.progressService.disable();
                this.checkOrderStatus(order)
              },
              err => {
                this.openSnackBar('خطا در هنگام کنسل کردن');
                console.error('error in canceling order:', err);
                this.progressService.disable();
              }
            );
        }
      }, err => {
        console.log('Error in dialog: ', err);
      });
  }

  checkCancelOrder(order) {
    return !order.tickets.map(x => x.status).includes(ORDER_STATUS.WaitForInvoice) &&
      !!order.order_lines.find(x => !x.cancel)
  }

  cancelOrder(order) {
    this.showDialogCancelOrder(order);
  }

  checkReturnOrder(order) {
    // this.returnOrderTime = moment(order.order_time).add(7, 'd');
    // if (this.returnOrderTime > Date.now()) {
    //   this.expiredTime = false;
    //   return (order.last_ticket.status === ORDER_STATUS.Delivered)
    // }
    // else {
    //   this.expiredTime = true;
    //   return OrderStatuses.find(x => x.status === order.last_ticket.status).title || '-';
    // }
  }

  returnOrder(order) {
    // if (this.responsiveService.isMobile) {
    //   this.router.navigate([`/profile/orderlines/return`]);
    // } else {
    //   const rmDialog = this.dialog.open(OrderReturnComponent, {
    //     width: '700px',
    //     data: this.profileOrder.find(x => x._id === order._id),
    //
    //   });
    //   rmDialog.afterClosed().subscribe(res => {
    //     // this.closeDialog.emit(true);
    //   });
    // }
  }

  checkOrderStatus(order) {

    if (order.tickets.map(x => x.status).includes(ORDER_STATUS.WaitForInvoice || order.order_lines.find(x => x.cancel)))
      // return 'sefresh';
      return OrderStatuses.find(x => x.status === ORDER_STATUS.CancelRequested).title || '-';

    else if(!(!order.tickets.map(x => x.status).includes(ORDER_STATUS.WaitForInvoice) &&
      !!order.order_lines.find(x => !x.cancel)))
      return OrderStatuses.find(x => x.status === order.last_ticket.status).title || '-';
  }
}



