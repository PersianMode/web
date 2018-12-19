import {Component, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from 'app/shared/services/http.service';
import {SocketService} from 'app/shared/services/socket.service';
import {ProgressService} from 'app/shared/services/progress.service';
import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {OrderLineStatuses} from 'app/shared/lib/status';
import {ScanTrigger} from 'app/shared/enum/scanTrigger.enum';

@Component({
  selector: 'app-internal-delivery-box',
  templateUrl: './internal-delivery-box.component.html',
  styleUrls: ['./internal-delivery-box.component.css']
})
export class InternalDeliveryBoxComponent implements OnInit, AfterViewInit, OnDestroy {


  @Output() OnInternalDeliveryBoxCount = new EventEmitter();

  displayedColumns = ['position', 'details', 'name', 'barcode', 'count', 'status'];
  dataSource: MatTableDataSource<any>;


  pageSize = 10;
  total;

  trigger = ScanTrigger.SendInternal;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  socketSubscription: any = null;

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socketService: SocketService,
    private progressService: ProgressService) {}


  ngOnInit() {
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
      type: 'ScanInternalDelivery',
      manual: false
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();

      res.data.forEach((order, index) => {
        order['index'] = index + 1;
      });
      this.dataSource = new MatTableDataSource<any>(res.data);
      this.total = res.total || 0;
      this.OnInternalDeliveryBoxCount.emit(this.total);
    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در دریافت لیست سفارش‌های عادی');
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
  getOrderLineStatus(orderLine) {
    if (orderLine && orderLine.tickets) {
      const lastTicket = orderLine.tickets && orderLine.tickets.length ? orderLine.tickets[orderLine.tickets.length - 1] : null;
      return OrderLineStatuses.find(x => x.status === lastTicket.status).name;
    }
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

  onMismatchDetected() {
    this.progressService.enable();
  }

  ngOnDestroy(): void {
      this.socketSubscription.unsubscribe();
  }


}
