import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {OrderStatus} from '../../../../shared/lib/order_status';
import {STATUS} from '../../../../shared/enum/status.enum';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {ProgressService} from '../../../../shared/services/progress.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InboxComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnNewInboxCount = new EventEmitter();

  scanDisplayedColumns = ['position', 'details', 'name', 'barcode', 'count', 'status'];

  expandedElement: any;
  scanDataSource: MatTableDataSource<any>;

  pageSize = 10;
  scanTotal: boolean;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  socketObserver: any = null;

  hasManual = false;

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socketService: SocketService,
    private progressService: ProgressService) {
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {
    this.socketObserver = this.socketService.getOrderLineMessage();
  }

  ngAfterViewInit(): void {
    this.loadData();
    if (this.socketObserver) {
      this.socketObserver.subscribe(msg => {
        this.loadData();
      });
    }
  }

  loadData() {
    this.loadScan();
  }


  loadScan() {
    this.progressService.enable();

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'inbox',
      manual: false
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();

      res.data.forEach((order, index) => {
        order['index'] = index + 1;
      });
      this.scanDataSource = new MatTableDataSource<any>(res.data);
      console.log('scanDataSource', res.data);
      this.scanTotal = res.total || 0;
      this.OnNewInboxCount.emit(res.total);
    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در دریافت لیست سفارش‌های عادی');
    });
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
    this.loadData();
  }

  onPageChange($event: any) {
    this.loadData();
  }

  onMismatchDetected() {
    this.progressService.enable();
  }

  ngOnDestroy(): void {
    if (this.socketObserver)
      this.socketObserver.unsubscribe();
  }

}
