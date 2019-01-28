import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MatDialogRef, MatDialog, MatSnackBar} from '@angular/material';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import {DictionaryService} from '../../../../shared/services/dictionary.service';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {OrderLineStatuses, OrderStatuses} from '../../../../shared/lib/status';
import {ORDER_LINE_STATUS, ORDER_STATUS} from '../../../../shared/enum/status.enum';
import * as moment from 'moment';
import {OrderReturnComponent} from '../order-return/order-return.component';
import {getDiscounted} from 'app/shared/lib/discountCalc';

@Component({
  selector: 'app-order-lines',
  templateUrl: './order-lines.component.html',
  styleUrls: ['./order-lines.component.css']
})
export class OrderLinesComponent implements OnInit {

  orderObject: any;
  isMobile = false;
  orderInfo: any;
  orderLines = [];
  expiredTime = false;
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(private profileOrderService: ProfileOrderService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private progressService: ProgressService,
    private location: Location, private router: Router,
    private dict: DictionaryService,
    private responsiveService: ResponsiveService) {
    this.isMobile = this.responsiveService.isMobile;
  }

  ngOnInit() {
    this.orderInfo = this.profileOrderService.orderData;
    this.orderLines = this.orderInfo.dialog_order.order_lines;
    this.findBoughtColor(this.orderLines);
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
  }

  findBoughtColor(arr) {
    arr.forEach(el => {
      const boughtColor = el.product.colors.find(c => c._id === el.product_instance.product_color_id);
      el.boughtColor = boughtColor;
    });
  }

  onClose() {
    // TODO: guard is needed if any fields have been changed!
    if (this.isNotMobile) {
      this.closeDialog.emit(false);
    } else {
      this.location.back();
    }
  }

  navigateToProduct(product_id, color_id) {
    this.router.navigate(['/product', product_id, color_id]);
    this.closeDialog.emit(false);
  }

  makePersianNumber(a: string, isPrice) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {
      useGrouping: isPrice
    });
  }

  OrderLineStatus(ol) {
    if (ol.tickets && ol.tickets.length) {
      const ticketName = OrderLineStatuses.filter(os => os.status === ol.tickets[ol.tickets.length - 1].status)[0].title;
      return ol.cancel ? `${'لغو شده'} - ${ticketName}` : ticketName;

    }
  }


  getThumbnailURL(boughtColor, product) {
    return imagePathFixer(boughtColor.image.thumbnail, product._id, boughtColor._id);
  }

  returnOrder(ol) {
    this.orderObject = {
      orderLine: ol,
      order: this.orderInfo
    };
    this.profileOrderService.orderData = this.orderObject;
    if (this.responsiveService.isMobile) {
      this.router.navigate([`/profile/orderlines/return`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '700px',
        data: {
          componentName: DialogEnum.orderReturnComponent
        }
      });
      rmDialog.afterClosed().subscribe(res => {
        this.closeDialog.emit(true);
      });
    }
  }

  checkCancelOrderLine(ol) {
    try {
      const order = this.profileOrderService.orderData.dialog_order;

      return !order.tickets.map(x => x.status).includes(ORDER_STATUS.WaitForInvoice) && !ol.cancel;
    } catch (err) {
      return false;
    }

  }

  cancelOrderLine(ol) {
    const options: any = {
      orderId: this.orderInfo.orderId,
      orderLineId: ol.order_line_id,
    }
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
          // this request expect cancel order_lines
          this.httpService.post(`order/cancel`, options)
            .subscribe(
              data => {
                this.openSnackBar('کالای مورد نظر با موفقیت کنسل شد.');
                this.progressService.disable();
                this.orderInfo = this.profileOrderService.orderData;
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

  checkReturnOrderLine(ol) {
    try {
      const order = this.profileOrderService.orderData.dialog_order;

      const lastTicket = order.tickets[order.tickets.length - 1];

      const delivered = lastTicket.status === ORDER_STATUS.Delivered;

      const validTime = moment(lastTicket.timestamp).isAfter(moment().add(-7, 'd'));

      const isAvailable = !ol.tickets.map(y => y.status).includes(ORDER_LINE_STATUS.ReturnRequested);

      return delivered && validTime && isAvailable;
    } catch (err) {
      return false;
    }


  }



  returnOrderLine(orderLine) {
    const order = this.profileOrderService.orderData.dialog_order;

    if (this.responsiveService.isMobile) {
      this.router.navigate([`/profile/orderlines/return`]);
    } else {
      this.dialog.open(OrderReturnComponent, {
        width: '700px',
        data: {
          order,
          orderLine
        },

      });
    }

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }


  calculateOrderLinePrice(orderLine) {

    let price = orderLine.paid_price;
    if (this.orderInfo.dialog_order.coupon_code && this.orderInfo.dialog_order.coupon_discount) {
      price -= getDiscounted(price, this.orderInfo.dialog_order.coupon_discount);
    }

    return this.makePersianNumber(price, true);

  }


}
