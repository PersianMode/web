import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {EditOrderComponent} from '../../../cart/components/edit-order/edit-order.component';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import {OrderStatus} from '../../../../shared/lib/order_status';
import {DictionaryService} from '../../../../shared/services/dictionary.service';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import { ResponsiveService } from '../../../../shared/services/responsive.service';
import { RemovingConfirmComponent } from '../../../../shared/components/removing-confirm/removing-confirm.component';
import { HttpService } from '../../../../shared/services/http.service';
import { ProgressService } from '../../../../shared/services/progress.service';
import {STATUS} from '../../../../shared/enum/status.enum';


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
  noDuplicateOrderLine = [];
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
    this.removeDuplicates(this.orderLines);
    // this.orderStatus(this.noDuplicateOrderLine);
    this.findBoughtColor(this.noDuplicateOrderLine);
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
  }

  removeDuplicates(arr) {
    const instancArr = [];
    arr.forEach(el => {
      const gender = el.product.tags.find(tag => tag.tg_name.toUpperCase() === 'GENDER').name;
      if (instancArr.indexOf(el.product_instance._id) === -1) {
        instancArr.push(el.product_instance._id);
        el.quantity = 1;
        el.product_instance.displaySize = this.dict.setShoesSize(el.product_instance.size, gender, el.product.product_type.name);
        this.noDuplicateOrderLine.push(el);
      } else {
        this.noDuplicateOrderLine.find(x => x.product_instance._id === el.product_instance._id).quantity++;
      }
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
    return (+a).toLocaleString('fa', {useGrouping: isPrice});
  }

  orderStatus(ol) {
    return  ol.tickets.length > 0 ? OrderStatus.filter(os => os.status === ol.tickets[ol.tickets.length - 1].status)[0].title : 'نامشخص';
    // let tickets = [];
    // arr.forEach(el => {
    //   tickets = el.tickets;
    //   el['statusText'] = el.tickets && OrderStatus.filter(os => os.status === tickets[tickets.length - 1].status)[0].title;
    // });
  }

  getThumbnailURL(boughtColor, product) {
    return imagePathFixer(boughtColor.image.thumbnail, product._id, boughtColor._id);
  }

  checkReturnOrderLine(ol) {
    const date =  ((+new Date(this.orderInfo.dialog_order.order_time)) + (1000 * 60 * 60 * 24 * 14)) - (+new Date());
    const statusReturn = ol.tickets && ol.tickets.filter(ticket => ticket.status === STATUS.Return);
    const statusDelivered = ol.tickets && ol.tickets.filter(ticket => ticket.status === STATUS.Delivered);
    if (statusDelivered.length && !statusReturn.length && date > 0 && !ol['returnFlag'] ) return true;
    else return false;
  }

  returnOrderLine(ol) {
    this.orderObject = {
      orderLine: ol,
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
        // this.orderInfo = this.profileOrderService.orderData;
        // this.orderLines = this.orderInfo.dialog_order.order_lines;
        this.closeDialog.emit(false);
      });
    }
  }

  cancelOrderLine(ol) {
    const orderLine = {_id: ol.order_line_id};
    const order = {_id: this.orderInfo.orderId};

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          // TODO send delete request
          this.httpService.post(`order/cancel`, {order, orderLine}).subscribe(
            data => {
              this.openSnackBar('کالا مورد نظر با موفقیت کنسل شد.');
              // this.isLoadingResults = false;
              this.changeOrderLine(ol);
              this.closeDialog.emit(false);
              this.progressService.disable();
            },
            err => {
              // this.isLoadingResults = false;
              this.openSnackBar('خطا در هنگام کنسل کردن');
              this.progressService.disable();
            }
          );
        }
      }, err => {
        console.log('Error in dialog: ', err);
      });
  }

  checkCancelOrderLine(ol) {
    const status = ol.tickets && ol.tickets.filter(ticket => ticket.status === STATUS.OnDelivery);
    if (!ol['cancelFlag'] && !status.length) return true;
    else return false;
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
}
