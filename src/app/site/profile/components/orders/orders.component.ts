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


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  profileOrder = [];

  displayedColumns = ['col_no', 'date', 'order_lines', 'total_amount', 'discount', 'used_point', 'address', 'view_details', 'return_order'];
  isMobile = false;
  selectedOrder;
  isQuantityMoreThanOne;
  quantities: any[] = [];
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

  showDialogCancelOrder(ol, multi: boolean) {
    let options: any = {
      orderId: this.orderInfo.orderId,
      orderLineId: ol.order_line_id,
      productIntanceId: ol.product_instance._id
    }
    if (multi) {
      options = {
        orderId: this.orderInfo.orderId,
        orderLineId: ol.order_line_id,
        quantity: 1,
        // this.quantitySelected,
        productIntanceId: ol.product_instance._id
      };
    }
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          // this request expect cancel order_lines
          this.httpService.post(`order/cancel`, options)
            .subscribe(
              data => {
                this.openSnackBar('کالای مورد نظر با موفقیت کنسل شد.');
                this.changeOrderLine(ol);
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
    return order.tickets.every(tk =>
      tk.status === ORDER_STATUS.WaitForAggregation
    );
  }

  checkReturnOrder(order) {

    const date = Date.parse(this.orderInfo.dialog_order.order_time) + (1000 * 60 * 60 * 24 * 14);
    return order.tickets.find(tk => tk.status === ORDER_STATUS.Return
      && date > Date.now()
    );
  }

  returnOrder(orders) {
    this.orderObject = {
      orderLine: orders,
      order: this.orderInfo
    };
    this.profileOrderService.orderData = this.orderObject;
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

  cancelOrder(orders) {
    this.quantities = [];
    // check if quantity more than 1, we need show have many order_line need to cancel
    if (orders.quantity > 1) {
      for (let index = 1; index <= orders.quantity; index++) {
        this.quantities.push({
          value: index,
          viewValue: index
        });
      }
      this.isQuantityMoreThanOne = orders.order_line_id;
    } else {
      this.showDialogCancelOrder(orders, false);
    }
  }
}

