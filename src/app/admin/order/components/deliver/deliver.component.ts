import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {OrderStatus} from '../../../../shared/lib/order_status';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {STATUS} from '../../../../shared/enum/status.enum';
import {ProductViewerComponent} from 'app/admin/order/components/product-viewer/product-viewer.component';
import {ProgressService} from '../../../../shared/services/progress.service';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import * as moment from 'jalali-moment';
import {animate, state, style, transition, trigger} from '@angular/animations';



@Component({
  selector: 'app-deliver',
  templateUrl: './deliver.component.html',
  styleUrls: ['./deliver.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeliverComponent implements OnInit, OnDestroy {



  @Output() OnNewOutboxCount = new EventEmitter();

  displayedColumns = [
    'position',
    'customer',
    'is_collect',
    'order_time',
    'total_order_lines',
    'address',
    'used_balance',
    'status',
    'process_order'
  ];

  dataSource = new MatTableDataSource();
  expandedElement: any;

  pageSize = 10;
  resultsLength: Number;

  batchScanDialogRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  socketObserver: any = null;

  constructor(private httpService: HttpService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private socketService: SocketService,
              private progressService: ProgressService) {
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {

    this.load();
    this.socketObserver = this.socketService.getOrderLineMessage();
    if (this.socketObserver) {
      this.socketObserver.subscribe(msg => {
        this.load();
      });
    }

  }

  load() {

    this.progressService.enable();

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      // change inbox to outbox when API created
      type: 'inbox'
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();

      const rows = [];
      res.data.forEach(order => {
        rows.push(order, {detailRow: true, order});
      });
      this.dataSource.data = rows;
      this.resultsLength = res.total ? res.total : 0;
      console.log('-> ', this.dataSource.data);
      // this.OnNewOutboxCount.emit(res.total);
    }, err => {
      this.progressService.disable();
      // this.OnNewOutboxCount.emit(0);
      this.openSnackBar('خطا در دریافت لیست سفارش‌ها');
    });
  }


  getIndex(order) {

    let index = this.dataSource.data.findIndex((elem: any) => order._id === elem._id);
    if (index === 0)
      index = 1;
    return index;
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

  // batchScan() {
  //   this.batchScanDialogRef = this.dialog.open(BarcodeCheckerComponent, {
  //     disableClose: true,
  //     width: '960px',
  //     height: '600px',
  //   });
  //   this.batchScanDialogRef.afterClosed().subscribe(res => {
  //     this.load();
  //   });

  // }

  showDetial(orderLine) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLine)
    });
  }


  getOrderStatus(order) {

    return '';
  }

  getOrderLineStatus(orderLine) {
    if (orderLine && orderLine.tickets)
      return OrderStatus.find(x => x.status === orderLine.tickets.find(y => !y.is_processed).status).name;
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
    return false;

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
    // if (this.socketObserver)
    //   this.socketObserver.unsubscribe();
  }

  showTicket(order, orderLine) {
    // const _orderId = order._id;
    // const _orderLineId = orderLine.order_line_id;
    // this.dialog.open(TicketComponent, {
    //   width: '1000px',
    //   data: {_orderId, _orderLineId}
    // });
  }
}
