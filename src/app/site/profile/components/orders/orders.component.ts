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
import {ORDER_STATUS, ORDER_LINE_STATUS} from '../../../../shared/enum/status.enum';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {OrderStatuses, OrderLineStatuses} from '../../../../shared/lib/status';
import * as moment from 'moment';
import {OrderReturnComponent} from '../order-return/order-return.component';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  profileOrder = [];
  displayedColumns = [
    'col_no',
    'date',
    'order_lines',
    'total_amount',
    'used_point',
    'address',
    'view_details',
    'status',
    'actions'
  ];
  isMobile = false;
  selectedOrder;
  orderInfo: any;
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



  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  checkCancelOrder(order) {
    try {
      return !order.tickets.map(x => x.status).includes(ORDER_STATUS.WaitForInvoice) &&
        !!order.order_lines.find(x => !x.cancel);
    } catch (err) {
      return false;
    }
  }

  cancelOrder(order) {
    const options: any = {
      orderId: order._id,
    };
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
      data: {
        name: 'لغو سفارش',
        message: 'در صورت لغو سفارش هزینه آن به موجودی شما افزوده خواهد شد.'
      }
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
                this.profileOrderService.getAllOrders();
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

  checkReturnOrder(order) {
    try {

      const lastTicket = order.tickets[order.tickets.length - 1];

      const delivered = lastTicket.status === ORDER_STATUS.Delivered;

      const validTime = moment(lastTicket.timestamp).isAfter(moment().add(-7, 'd'));

      const hasAvailableOrderLine =
        !!order.order_lines.find(x => !x.tickets.map(y => y.status).includes(ORDER_LINE_STATUS.ReturnRequested));

      return delivered && validTime && hasAvailableOrderLine;
    } catch (err) {
      return false;
    }
  }

  returnOrder(order) {

    if (this.responsiveService.isMobile) {
      this.router.navigate([`/profile/orderlines/return`]);
    } else {
      this.dialog.open(OrderReturnComponent, {
        width: '700px',
        data: {
          order: this.profileOrder.find(x => x._id === order._id),
        }
      });
    }

  }

  getOrderStatus(order) {

    try {

      const isDelivered = order.tickets.map(x => x.status).includes(ORDER_STATUS.Delivered);
      const hasNotCanceledOrderLine = order.order_lines.find(x => {
        return !x.tickets.map(y => y.status).includes(ORDER_LINE_STATUS.CancelRequested);
      });
      const hasNotReturnedOrderLine = order.order_lines.find(x => {
        return !x.tickets.map(y => y.status).includes(ORDER_LINE_STATUS.ReturnRequested);
      });

      if (isDelivered && hasNotReturnedOrderLine) {
        return OrderStatuses.find(x => x.status === ORDER_STATUS.Delivered).title;
      } else if (isDelivered && !hasNotReturnedOrderLine) {
        return OrderLineStatuses.find(x => x.status === ORDER_LINE_STATUS.ReturnRequested).title;
      } else if (!isDelivered && !hasNotCanceledOrderLine) {
        return OrderLineStatuses.find(x => x.status === ORDER_LINE_STATUS.CancelRequested).title;
      } else if (!isDelivered && hasNotCanceledOrderLine) {
        return OrderStatuses.find(x => x.status === order.tickets[order.tickets.length - 1].status).title;
      }

    } catch (error) {
      return 'نامشخص';
    }

  }
}



