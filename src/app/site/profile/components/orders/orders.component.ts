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
import {ORDER_LINE_STATUS, ORDER_STATUS} from '../../../../shared/enum/status.enum';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {OrderStatuses} from '../../../../shared/lib/status';
import * as moment from 'moment';


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
  isQuantityMoreThanOne;
  quantities: any[] = [];
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
    console.log('order info', this.orderInfo);
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
    console.log('profile order', this.profileOrder);
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

  showDialogCancelOrder(ol, multi: boolean) {
    let options: any = {
      orderId: this.orderInfo.orderId,
      orderLineId: ol.order_line_id,
      // productInstanceId: ol.product_instance._id
    }
    if (multi) {
      options = {
        orderId: this.orderInfo.orderId,
        orderLineId: ol.order_line_id,
        quantity: 1,
        // this.quantitySelected,
        productInstanceId: ol.product_instance._id
      };
    }
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          ol.last_ticket.status = 9;
          // this request expect cancel order_lines
          this.httpService.post(`order/cancel`, options)
            .subscribe(
              data => {
                this.openSnackBar('کالای مورد نظر با موفقیت کنسل شد.');
                // this.changeOrderLine(ol);
                this.closeDialog.emit(false);
                this.progressService.disable();
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
    return (order.last_ticket.status === ORDER_STATUS.WaitForAggregation)
  }

  cancelOrder(order) {
    this.quantities = [];
    // check if quantity more than 1, we need show how many order_line need to cancel
    if (order.quantity > 1) {
      for (let index = 1; index <= order.quantity; index++) {
        this.quantities.push({
          value: index,
          viewValue: index
        });
      }
      this.isQuantityMoreThanOne = order.order_line_id;
    } else {
      this.showDialogCancelOrder(order, false);
    }
  }

  checkReturnOrder(order) {
    this.returnOrderTime = moment(order.order_time).add(7, 'd');
    if (this.returnOrderTime > Date.now()) {
      this.expiredTime = false;
      return (order.last_ticket.status === ORDER_STATUS.Delivered)
    }
    else {
      this.expiredTime = true;
      return OrderStatuses.find(x => x.status === order.last_ticket.status).title || '-';
    }
  }

  returnOrder(order) {
    // this.orderObject = {
    //   orderLine: orders,
    //   order: this.orderInfo
    // };
    // this.profileOrderService.orderData = this.orderObject;
    if (this.responsiveService.isMobile) {
      this.router.navigate([`/profile/orderline/return`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '700px',
        data: {
          componentName: DialogEnum.orderReturnComponent
        }
      });
      rmDialog.afterClosed().subscribe(res => {
        this.closeDialog.emit(false);

      });
    }
  }

  checkOrderStatus(order) {
    if (!((order.last_ticket.status === ORDER_STATUS.Delivered && !this.expiredTime) || order.last_ticket.status === ORDER_STATUS.WaitForAggregation))
      return OrderStatuses.find(x => x.status === order.last_ticket.status).title || '-';
  }
}

