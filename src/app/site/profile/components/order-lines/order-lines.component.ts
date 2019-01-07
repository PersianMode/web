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
  returnOrderTime;
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
    return ol.tickets.length !== 0 ? OrderLineStatuses.filter(os => os.status === ol.tickets[ol.tickets.length - 1].status)[0].title : 'نامشخص';
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

  showDialogCancelOrderLine(ol) {
    let options: any = {
      orderId: this.orderInfo.orderId,
      orderLineId: ol.order_line_id,
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

  checkCancelOrderLine(ol) {
    return !this.orderInfo.dialog_order.tickets.map(x => x.status).includes(ORDER_STATUS.WaitForInvoice) && !ol.cancel;

  }

  cancelOrderLine(ol) {
    this.showDialogCancelOrderLine(ol);
  }

  checkReturnOrderLine(ol) {
    // this.returnOrderTime = moment(this.orderInfo.dialog_order.order_time).add(7, 'd');
    // if (this.returnOrderTime > Date.now()) {
    //   this.expiredTime = false;
    //   return (this.orderInfo.dialog_order.last_ticket.status === ORDER_STATUS.Delivered && !(ol.order_lines_ticket.status === ORDER_STATUS.Return))
    // }
    // else {
    //   this.expiredTime = true;
    //   return OrderStatuses.find(x => x.status === this.orderInfo.dialog_order.last_ticket.status).title || '-';
    // }
  }


  returnOrderLine(order) {
    // this.orderObject = {
    //   orderLine: orders,
    //   order: this.orderInfo
    // };
    // this.profileOrderService.orderData = this.orderObject;
    // if (this.responsiveService.isMobile) {
    //   this.router.navigate([`/profile/orderlines/return`]);
    // } else {
    //   const rmDialog = this.dialog.open(GenDialogComponent, {
    //     width: '700px',
    //     data: {
    //       componentName: DialogEnum.orderReturnComponent
    //     }
    //   });
    //   rmDialog.afterClosed().subscribe(res => {
    //     this.closeDialog.emit(false);
    //   });
    // }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

}
