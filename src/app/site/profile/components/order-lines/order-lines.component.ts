import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {EditOrderComponent} from '../../../cart/components/edit-order/edit-order.component';
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
import {ORDER_LINE_STATUS} from 'app/shared/enum/status.enum';
import {ORDER_STATUS} from '../../../../shared/enum/status.enum';
import * as moment from 'moment';

@Component({
  selector: 'app-order-lines',
  templateUrl: './order-lines.component.html',
  styleUrls: ['./order-lines.component.css']
})
export class OrderLinesComponent implements OnInit {
  quantitySelected;
  isQuantityMoreThanOne;
  quantities: any[] = [];


  stautsCancel: boolean;
  orderObject: any;
  isMobile = false;
  orderInfo: any;
  orderLines = [];
  noDuplicateOrderLine = [];
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
    console.log('orderInfo', this.orderInfo);
    this.orderLines = this.orderInfo.dialog_order.order_lines;
    console.log('orderLines',this.orderLines);
    this.removeDuplicates(this.orderLines);
    // this.OrderLineStatus(this.noDuplicateOrderLine);
    this.findBoughtColor(this.noDuplicateOrderLine);
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
  }

  removeDuplicates(arr) {
    const instancArr = [];
    arr.forEach(el => {
      this.orderInfo.dialog_order.order_lines
        .forEach(elx => {
          if (elx.order_line_id === el.order_line_id)
            el['order_id'] = this.orderInfo.dialog_order._id;
        });
      const gender = el.product.tags.find(tag => tag.tg_name.toUpperCase() === 'GENDER').name;
      // if (instancArr.indexOf(el.product_instance._id) === -1) {
      instancArr.push(el.product_instance._id);
      el.quantity = 1;
      el.product_instance.displaySize = this.dict.setShoesSize(el.product_instance.size, gender, el.product.product_type.name);
      this.noDuplicateOrderLine.push(el);
      // }
      // else {
      //   this.noDuplicateOrderLine.find(x => x.product_instance._id === el.product_instance._id).quantity++;
      // }
    });
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

  // OrderLineStatus(arr) {
  //   let tickets = [];
  //   let statusText = '';
  //   arr.forEach(el => {
  //     tickets = el.tickets;
  //     if (tickets.length)
  //       statusText = OrderLineStatus.filter(os => os.status === tickets[tickets.length - 1].status)[0].title;
  //     else statusText = '--';
  //     el.statusText = statusText;
  //   });
  // }

  getThumbnailURL(boughtColor, product) {
    return imagePathFixer(boughtColor.image.thumbnail, product._id, boughtColor._id);
  }


  // returnOrderLine(ol) {
  //   this.orderObject = {
  //     orderLine: ol,
  //     order: this.orderInfo
  //   };
  //   this.profileOrderService.orderData = this.orderObject;
  //   if (this.responsiveService.isMobile) {
  //     this.router.navigate([`/profile/orderline/return`]);
  //   } else {
  //     const rmDialog = this.dialog.open(GenDialogComponent, {
  //       width: '700px',
  //       data: {
  //         componentName: DialogEnum.orderReturnComponent
  //       }
  //     });
  //     rmDialog.afterClosed().subscribe(res => {
  //       this.closeDialog.emit(false);
  //     });
  //   }
  // }
  //

  //
  // cancelOrderLine(ol) {
  //   this.quantities = [];
  //   // check if quantity more than 1, we need show have many order_line need to cancel
  //   if (ol.quantity > 1) {
  //     for (let index = 1; index <= ol.quantity; index++) {
  //       this.quantities.push({
  //         value: index,
  //         viewValue: index
  //       });
  //     }
  //     this.isQuantityMoreThanOne = ol.order_line_id;
  //   } else {
  //     this.showDialogCancelOrderLine(ol, false);
  //   }
  // }

  showDialogCancelOrder(ol, multi: boolean) {
    console.log('olllll',ol);
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
          this.orderLineCheck(ol);

          // this request expect cancel order_lines
          this.httpService.post(`order/cancel`, options)
            .subscribe(
              data => {
                this.openSnackBar('کالای مورد نظر با موفقیت کنسل شد.');
                // this.changeOrderLine(ol);
                // this.closeDialog.emit(true);
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

  checkCancelOrderLine(order) {
    return (order.last_ticket.status === ORDER_STATUS.WaitForAggregation)
  }

  cancelOrderLine(order) {
    this.quantities = [];
    // check if quantity more than 1, we need show have many order_line need to cancel
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

  checkReturnOrderLine(order) {
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

  returnOrderLine(order) {
    // this.orderObject = {
    //   orderLine: orders,
    //   order: this.orderInfo
    // };
    // this.profileOrderService.orderData = this.orderObject;
    if (this.responsiveService.isMobile) {
      this.router.navigate([`/profile/orderline/return`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '600px',
        data: {
          componentName: DialogEnum.orderReturnComponent
        }
      });
      rmDialog.afterClosed().subscribe(res => {
        this.closeDialog.emit(false);
      });
    }
  }

  checkOrderLineStatus(order) {
    if (!((order.last_ticket.status === ORDER_STATUS.Delivered && !this.expiredTime) || order.last_ticket.status === ORDER_STATUS.WaitForAggregation) )
      return OrderStatuses.find(x => x.status === order.last_ticket.status).title || '-';
  }


  showDialogCancelOrderLine(ol, multi: boolean) {
    let options: any = {
      orderId: this.orderInfo.orderId,
      orderLineId: ol.order_line_id,
      productIntanceId: ol.product_instance._id
    }
    if (multi) {
      options = {
        orderId: this.orderInfo.orderId,
        orderLineId: ol.order_line_id,
        quantity: this.quantitySelected,
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

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  changeOrderLine(ol) {
    const updateOrderLines = [];
    this.orderInfo.dialog_order.order_lines.forEach(el => {
      if (el.order_line_id === ol.order_line_id) {
        el['cancelFlag'] = true;
        updateOrderLines.push(el);
      } else updateOrderLines.push(el);
    });
    this.orderInfo.dialog_order.order_lines = updateOrderLines;
  }

  cancelOrderLineByQuantity(ol) {
    console.log('ol', ol);
    this.showDialogCancelOrderLine(ol, true);
  }

  orderLineCheck(ol) {
    // ol.order_lines.ticket
    console.log(111);
  }
}
