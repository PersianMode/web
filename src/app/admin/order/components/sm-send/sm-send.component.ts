import {Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy} from '@angular/core';
import {TicketComponent} from '../ticket/ticket.component';
import {STATUS} from '../../../../shared/enum/status.enum';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {OrderStatus} from '../../../../shared/lib/order_status';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {BarcodeCheckerComponent} from '../barcode-checker/barcode-checker.component';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import * as moment from 'jalali-moment';
import {HttpService} from '../../../../shared/services/http.service';
import {MatDialog, MatSnackBar, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthService} from '../../../../shared/services/auth.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sm-send',
  templateUrl: './sm-send.component.html',
  styleUrls: ['./sm-send.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SmSendComponent implements OnInit, OnDestroy {

  @Output() OnNewInboxCount = new EventEmitter();

  displayedColumns = [
    'position',
    'customer',
    'order_time',
  ];

  dataSource = new MatTableDataSource();
  expandedElement: any;

  pageSize = 10;
  resultsLength: Number;

  batchScanDialogRef;

  statusSearchCtrl = new FormControl();
  receiverSearchCtrl = new FormControl();
  invoiceNoCtrl = new FormControl();

  warehouseOrCutomerName = null;
  invoiceNo = null;
  isStatus = null;
  addingTime = null;
  listStatus: {name: string, status: number}[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  socketObserver: any = null;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private socketService: SocketService,
    private progressService: ProgressService) {
  }

  ngOnInit() {
    // set status
    this.listStatus = OrderStatus.map(el => ({name: el.name, status: el.status}));
    this.listStatus.push({name: 'همه موارد', status: null});
    this.receiverSearchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.warehouseOrCutomerName = data.trim() !== '' ? data.trim() : null;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when receiver name is changed: ', err);
      }
    );

    this.invoiceNoCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.invoiceNo = data.trim() !== '' ? data.trim() : null;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when agent name is changed: ', err);
      }
    );

    this.statusSearchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.isStatus = data;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when agent name is changed: ', err);
      }
    );

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
      invoiceNo: this.invoiceNo,
      transferee: this.warehouseOrCutomerName,
      addingTime: this.addingTime,
      status: this.isStatus,

      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'outbox',
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();
      const rows = [];
      res.data.forEach((order, index) => {
        order['index'] = index + 1;
        rows.push(order, {detailRow: true, order});
      });
      this.dataSource.data = rows;
      this.resultsLength = res.total ? res.total : 0;
      this.dataSource.data.forEach((o: any) => {
        if (o.order_lines) {

          o.order_lines.forEach(ol => {
            const lastTicket = ol.tickets[ol.tickets.length - 1];
            if (lastTicket.status === 10) {
              ol.isDelivered = true;
              ol.returnTime = lastTicket.desc.day_slot;
            } else {
              ol.isDelivered = false;
            }
          });
        }
      });
      this.OnNewInboxCount.emit(res.total);
    }, err => {
      this.progressService.disable();
      this.OnNewInboxCount.emit(0);
      this.openSnackBar('خطا در دریافت لیست سفارش‌ها');
    });
  }


  // getIndex(order) {

  //   let index = this.dataSource.data.findIndex((elem: any) => order._id === elem._id);
  //   if (index === 0)
  //     index = 1;
  //   return index;
  // }

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

  showAddress(order, order_line = -1) {
    let finalAddress = order.address;
    if (order_line !== -1) {
      const ticketsOfOrderLine = order.order_lines.find(x => x.order_line_id.toString() === order_line).tickets;
      const lastTicketOfOrderLine = ticketsOfOrderLine[ticketsOfOrderLine.length - 1];
      if (lastTicketOfOrderLine && lastTicketOfOrderLine.status === 10) {
        const returnAddressId = lastTicketOfOrderLine.desc.reciver_id.toString();
        finalAddress = order.customer.addresses.find(x => x._id.toString() === returnAddressId);
      }
    }
    if (!order.address) {
      this.openSnackBar('order line has no address!');
      return;
    }

    this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address: finalAddress, is_collect: !!order.is_collect}
    });

  }


  isReadyForInvoice(order) {
    return order.order_lines.every(x => {
      const lastTicket = x.tickets && x.tickets.length ? x.tickets[x.tickets.length - 1] : null;
      return lastTicket && !lastTicket.is_processed && (lastTicket.status === STATUS.ReadyForInvoice
        || lastTicket.status === STATUS.WaitForInvoice);

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

  // ngOnDestroy(): void {
  // if (this.socketObserver)
  //   this.socketObserver.unsubscribe();
  // }

  showTicket(order, orderLine) {
    const _orderId = order._id;
    const _orderLineId = orderLine.order_line_id;
    this.dialog.open(TicketComponent, {
      width: '1000px',
      data: {_orderId, _orderLineId}
    });
  }

  ngOnDestroy(): void {
    if (this.socketObserver)
      this.socketObserver.unsubscribe();
  }

}
