import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-order-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {


  @Output() newInboxCount = new EventEmitter();

  displayedColumns = [
    'position',
    'product',
    'is_collect',
    'barcode',
    'price',
    'used_point',
    'used_balance',
    'customer',
    'address',
    'status',
    'process'
  ];

  dataSource = new MatTableDataSource();

  pageSize = 20;
  resultsLength: Number;

  processDialogRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private socketService: SocketService,
    private progressService: ProgressService) {
  }

  ngOnInit() {
    this.load();

    this.socketService.getOrderLineMessage().subscribe(msg => {
      if (this.processDialogRef)
        this.processDialogRef.close();

      this.load();
    });
  }

  load() {

    this.progressService.enable();

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'inbox'
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Order', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();
      this.newInboxCount.emit(res.total);
      this.dataSource.data = res.data;
      this.resultsLength = res.data.length ? res.data.length : 0;
      console.log('-> ', this.dataSource.data);
    }, err => {
      this.progressService.disable();
      this.newInboxCount.emit(0);
      this.openSnackBar('خطا در دریافت لیست سفارش ها');
    });
  }


  getIndex(element) {
    return this.dataSource.data.indexOf(element) + 1;
  }

  getProductDetail(element) {

    const product_color = element.product_colors.find(x => x._id === element.instance.product_color_id);
    const thumbnailURL = (product_color && product_color.image && product_color.image.thumbnail) ?
      [HttpService.Host,
      HttpService.PRODUCT_IMAGE_PATH,
      element.product_id,
      product_color.color_id,
      product_color.image.thumbnail].join('/')
      : null;
    return {
      name: element.product_name,
      thumbnailURL,
      color: product_color ? product_color.name : null,
      color_code: product_color ? product_color.code : null,
      size: element.instance.size,
      product_id: element.product_id
    };
  }

  showDetial(element) {
    this.processDialogRef = this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(element)
    });
  }


  getStatus(element) {

    const orderStatus = OrderStatus.find(x => x.status === element.tickets.status);
    return orderStatus ? orderStatus.name : 'نامشخص';

  }

  showAddress(element) {

    if (!element.address) {
      this.openSnackBar('order line has no address !');
      return;
    }

    this.processDialogRef = this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address: element.address, is_collect: !!element.is_collect}
    });


  }

  process(element) {

    this.processDialogRef = this.dialog.open(BarcodeCheckerComponent, {
      width: '400px',
      data: {barcode: element.instance.barcode}
    });

    this.processDialogRef.afterClosed().subscribe(isMatched => {


      if (isMatched)
        this.makeDesicion(element);

    });
  }
  makeDesicion(element) {

    if (element.tickets.status === STATUS.default)
      this.addToOnlineWarehouse(element);
  }

  addToOnlineWarehouse(element) {

    this.progressService.enable();
    this.httpService.post('order/ticket/onlineWarehouse', {
      orderId: element._id,
      orderLineId: element.order_line_id
    }).subscribe(res => {
      this.progressService.disable();
      this.openSnackBar('درخواست به انبار آنلاین با موفقیت ارسال شد');

    }, err => {
      this.openSnackBar('خطا در اضافه نمودن محصول به انبار آنلاین');
      this.progressService.disable();
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

}
