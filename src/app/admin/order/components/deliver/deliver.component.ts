import {Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy} from '@angular/core';
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

@Component({
  selector: 'app-deliver',
  templateUrl: './deliver.component.html',
  styleUrls: ['./deliver.component.css']
})
export class DeliverComponent implements OnInit, OnDestroy {


  @Output() newDeliverCount = new EventEmitter();


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
    'status'
  ];

  dataSource = new MatTableDataSource();

  resultsLength = 0;
  pageSize = 20;

  processDialogRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  socketObserver: any = null;


  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private socketService: SocketService,
    private progeressService: ProgressService) {
  }

  ngOnInit() {
    // this.load();

    this.socketObserver = this.socketService.getOrderLineMessage();
    if (this.socketObserver) {
      this.socketObserver.subscribe(msg => {
        if (this.processDialogRef)
          this.processDialogRef.close();

        // this.load();
      });
    }
  }

  load() {
    this.progeressService.enable();
    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'readyToDeliver'
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.resultsLength = res.total;
      this.dataSource.data = res.data;


      this.newDeliverCount.emit(this.resultsLength);

      this.progeressService.disable();
      console.log('-> ', this.dataSource.data);
    }, err => {
      this.progeressService.disable();
      this.resultsLength = 0;
      this.openSnackBar('خطا در دریافت لیست سفارش‌ها');
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
      product_color._id,
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

    this.processDialogRef = this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address: element.address, is_collect: !!element.is_collect}
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
    // if (this.socketObserver)
    //   this.socketObserver.unsubscribe();
  }
}
