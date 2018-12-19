import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar} from '@angular/material';
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as moment from 'jalali-moment';
import {ORDERS} from '../order-mock';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {ScanTrigger} from 'app/shared/enum/scanTrigger.enum';
import {HttpService} from 'app/shared/services/http.service';
import {SocketService} from 'app/shared/services/socket.service';
import {ProgressService} from 'app/shared/services/progress.service';

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

  displayedColumns = ['position', 'customer', 'order_time', 'total_order_lines', 'address', 'process_order'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  pageSize = 10;
  total;

  trigger = ScanTrigger.SendCustomer;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  socketSubscription: any = null;

  expandedElement: any;

  showBarcodeScanner = false;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socketService: SocketService,
    private progressService: ProgressService) {

  }


  ngOnInit() {
    this.load();
  }

  ngAfterViewInit(): void {
    this.load();
    this.socketSubscription = this.socketService.getOrderLineMessage().subscribe(msg => {
      this.load();
    });
  }

  load() {
    this.progressService.enable();

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'ScanExternalDelivery',
      manual: false
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
      this.total = res.total ? res.total : 0;
      this.total = res.total || 0;
      this.OnExternalDeliveryBoxCount.emit(this.total);

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در دریافت لیست سفارش‌های عادی');
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

  showDetial(orderLine) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLine)
    });
  }

  onMismatchDetected() {
    //
  }

  onScanOrder() {
    this.showBarcodeScanner = true;
  }

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }
}
