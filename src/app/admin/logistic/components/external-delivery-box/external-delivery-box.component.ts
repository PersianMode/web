import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as moment from 'jalali-moment';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {ScanTrigger} from 'app/shared/enum/scanTrigger.enum';
import {HttpService} from 'app/shared/services/http.service';
import {SocketService} from 'app/shared/services/socket.service';
import {ProgressService} from 'app/shared/services/progress.service';
import {OrderLineStatuses, OrderStatuses} from 'app/shared/lib/status';
import {ORDER_STATUS} from 'app/shared/enum/status.enum';
import {RemovingConfirmComponent} from 'app/shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-external-delivery-box',
  templateUrl: './external-delivery-box.component.html',
  styleUrls: ['./external-delivery-box.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExternalDeliveryBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnExternalDeliveryBoxCount = new EventEmitter();
  @Input() isHub = false;

  displayedColumns = ['position',
    'customer',
    'order_time',
    'total_order_lines',
    'address',
    'aggregated',
    'order_status',
    'process_order',
    'invoice'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  pageSize = 10;
  total;


  trigger;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  socketSubscription: any = null;

  expandedElement: any;

  selectedOrder: any;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socketService: SocketService,
    private progressService: ProgressService) {

  }


  ngOnInit() {
    this.socketSubscription = this.socketService.getOrderLineMessage().subscribe(msg => {
      this.load();
    });
  }

  ngAfterViewInit(): void {
    this.load();

    this.trigger = this.isHub ? ScanTrigger.SendExternal : ScanTrigger.CCDelivery;

  }

  load() {
    this.progressService.enable();

    this.expandedElement = null;

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: this.isHub ? 'ScanExternalDelivery' : 'ScanToCustomerDelivery'
    };

    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();

      const rows = [];
      res.data.forEach((order, index) => {
        order['position'] = index + 1;
        rows.push(order, {detailRow: true, order});
      });
      this.dataSource.data = rows;
      this.total = res.total ? res.total : 0;
      this.total = res.total || 0;
      this.OnExternalDeliveryBoxCount.emit(this.total);

      if (this.selectedOrder) {
        setTimeout(() => {
          this.expandedElement = this.selectedOrder._id;
        }, 100);
      }

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در لیست ارسال های خارجی');
    });
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }



  onSortChange($event: any) {
    this.paginator.pageIndex = 0;
    this.load();
  }

  onPageChange($event: any) {
    this.load();
  }

  getDate(orderTime) {
    try {
      return moment(orderTime).format('jYYYY/jMM/jDD HH:mm:ss');
    } catch (err) {
      console.log('-> error on parsing order time : ', err);
    }
  }

  showAddress(order) {
    if (!order.address) {
      return;
    }
    this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address: order.address, is_collect: !!order.is_collect}
    });
  }

  getProductDetail(orderLine) {
    const product_color = orderLine.product_colors.find(x => x._id === orderLine.instance.product_color_id);
    const thumbnailURL = (product_color && product_color.image && product_color.image.thumbnail) ?
      imagePathFixer(product_color.image.thumbnail, orderLine.instance.product_id, product_color._id) :
      null;
    return {
      name: orderLine.instance.product_name,
      thumbnailURL,
      color: product_color ? product_color.name : null,
      color_code: product_color ? product_color.code : null,
      size: orderLine.instance.size,
      product_id: orderLine.instance.product_id
    };
  }

  getOrderStatus(order) {
    const lastTicket = order.tickets[order.tickets.length - 1];
    return OrderStatuses.find(x => x.status === lastTicket.status).name || '-';
  }

  getOrderLineStatus(orderLine) {
    try {
      const lastTicket = orderLine.tickets[orderLine.tickets.length - 1];
      const ticketName = OrderLineStatuses.find(x => x.status === lastTicket.status).name || '-';
      
      return orderLine.cancel ? `${'لغو شده'} - ${ticketName}` : ticketName; 
      
    } catch (err) {
    }

  }

  getCustomer(order) {
    try {
      return order.address.recipient_name + ' ' + order.address.recipient_surname;
    } catch (err) {
    }

  }

  showDetial(orderLine) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLine)
    });
  }

  readyForInvoice(order) {
    const lastTicket = order.tickets[order.tickets.length - 1];
    return lastTicket.status === ORDER_STATUS.WaitForInvoice;
  }
  invoice(order) {

    this.progressService.enable();

    this.httpService.post('order/invoice', {
      orderId: order._id
    }).subscribe(res => {
      this.progressService.disable();
      this.openSnackBar('درخواست صدور فاکتور با موفقیت ارسال شد');

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا به هنگام تلاش برای صدور فاکتور');
    });

  }

  lostReport(orderLine) {

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
      data: {
        name: 'اعلام مفقودی',
        message: 'در صورت اعلام مفقودی کالا، پیامی به مسئول فروش ارسال و فرایند تامین کالا از سر گرفته خواهد شد'
      }
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.post('order/lost', {
            orderId: orderLine.order_id,
            orderLineId: orderLine.order_line_id
          }).subscribe(res => {
            this.progressService.disable();
          }, err => {
            this.progressService.disable();
            this.openSnackBar('خطا به هنگام اعلام مفقودی محصول');
          });
        }
      },
      (err) => {
        console.log('Error in dialog: ', err);
      }
    );
  }
  
  onScanOrder(order) {
    this.selectedOrder = order;
    this.expandedElement = order._id;
  }

  isAggregated(order) {

    return order.total_order_lines === order.order_lines.length;
  }


  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }
}
