import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {OrderStatus} from '../../../../shared/lib/order_status';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {STATUS} from '../../../../shared/enum/status.enum';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {BarcodeCheckerComponent} from '../barcode-checker/barcode-checker.component';
import {ProgressService} from '../../../../shared/services/progress.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import * as moment from 'jalali-moment';
import {FormControl} from '@angular/forms';
import {TicketComponent} from '../ticket/ticket.component';
import {last} from 'rxjs/operators';
import {log} from 'util';


@Component({
  selector: 'app-sc-inbox',
  templateUrl: './sc-inbox.component.html',
  styleUrls: ['./sc-inbox.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SCInboxComponent implements OnInit, AfterViewInit, OnDestroy {



  @Output() OnNewInboxCount = new EventEmitter();

  CCDisplayedColumns = [
    'position',
    'customer',
    'order_time',
    'total_order_lines',
    'process'
  ];

  normalDisplayedColumns = [
    'position',
    'details',
    'name',
  ];

  CCDataSource = new MatTableDataSource();
  expandedElement: any;

  normalDataSource = new MatTableDataSource();

  pageSize = 10;
  resultsLength: Number;

  batchScanDialogRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  socketObserver: any = null;

  hasCC = false;

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private socketService: SocketService,
    private progressService: ProgressService) {
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {

    this.hasCC = !!this.authService.warehouses.find(x => x.has_customer_pickup &&
      !x.is_hub &&
      x._id === this.authService.userDetails.warehouse_id);

    this.socketObserver = this.socketService.getOrderLineMessage();

  }

  ngAfterViewInit(): void {
    this.load();
    if (this.socketObserver) {
      this.socketObserver.subscribe(msg => {
        this.load();
      });
    }
  }

  load() {
    if (this.hasCC)
      this.loadCC();

    this.loadNormal();
  }


  loadNormal() {
    this.progressService.enable();

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'inbox',
      isCollect: false
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();

      res.data.forEach((order, index) => {
        order['index'] = index + 1;
      });
      this.normalDataSource.data = res.data;
      this.resultsLength = res.total ? res.total : 0;
      this.OnNewInboxCount.emit(res.total);
    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در دریافت لیست سفارش‌های عادی');
    });
  }

  loadCC() {

    if (!this.hasCC)
      return;

    this.progressService.enable();

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'inbox',
      isCollect: true
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();

      console.log('-> ', res);   
      const rows = [];
      res.data.forEach((order, index) => {
        order['index'] = index + 1;
        rows.push(order, {detailRow: true, order});
      });
      this.CCDataSource.data = rows;
      this.resultsLength = res.total ? res.total : 0;
      this.OnNewInboxCount.emit(res.total);
    }, err => {
      this.progressService.disable();
      this.OnNewInboxCount.emit(0);
      this.openSnackBar('خطا در دریافت لیست سفارش‌های آماده تحویل');
    });
  }


  getDate(orderTime) {
    return moment(orderTime).format('jYYYY/jMM/jDD HH:mm:ss');
  }

  getProductDetail(orderLine) {

    const product_color = orderLine.product_colors.find(x => x._id === orderLine.instance.product_color_id);
    const thumbnailURL = (product_color && product_color.image && product_color.image.thumbnail) ?
      imagePathFixer(product_color.image.thumbnail, orderLine.instance.product_id, product_color._id)
      : null;
    return {
      name: orderLine.instance.product_name,
      thumbnailURL,
      color: product_color ? product_color.name : null,
      color_code: product_color ? product_color.code : null,
      size: orderLine.instance.size,
      product_id: orderLine.instance.product_id
    };
  }

  batchScan() {
    this.batchScanDialogRef = this.dialog.open(BarcodeCheckerComponent, {
      disableClose: true,
      width: '960px',
      height: '600px',
    });
    this.batchScanDialogRef.afterClosed().subscribe(res => {
      this.load();
    });

  }

  showDetial(orderLine) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLine)
    });
  }


  getOrderLineStatus(orderLine) {
    if (orderLine && orderLine.tickets) {
      const lastTicket = orderLine.tickets && orderLine.tickets.length ? orderLine.tickets[orderLine.tickets.length - 1] : null;
      return OrderStatus.find(x => x.status === lastTicket.status).name;
    }
  }

  showAddress(order) {

    if (!order.address) {
      this.openSnackBar('order line has no address!');
      return;
    }

    this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address: order.address, is_collect: !!order.is_collect}
    });

  }


  isReadyForInvoice(order) {
    return order.order_lines.every(x => {
      const lastTicket = x.tickets && x.tickets.length ? x.tickets[x.tickets.length - 1] : null;
      return lastTicket && !lastTicket.is_processed && (lastTicket.status === STATUS.ReadyForInvoice ||
        lastTicket.status === STATUS.WaitForInvoice);
    });
  }

  requestInvoice(order) {
    this.httpService.post('order/ticket/invoice', {
      orderId: order._id
    }).subscribe(res => {
      this.openSnackBar('درخواست صدور فاکتور با موفقیت انجام شد');
    }, err => {
      this.openSnackBar('خطا به هنگام درخواست صدور فاکتور');
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

  ngOnDestroy(): void {
    if (this.socketObserver)
      this.socketObserver.unsubscribe();
  }

  showTicket(order, orderLine) {
    const _orderId = order._id;
    const _orderLineId = orderLine.order_line_id;
    this.dialog.open(TicketComponent, {
      width: '1000px',
      data: {_orderId, _orderLineId}
    });
  }
}
