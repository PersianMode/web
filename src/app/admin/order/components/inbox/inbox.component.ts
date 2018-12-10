import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {OrderLineStatuses} from '../../../../shared/lib/status';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {ProgressService} from '../../../../shared/services/progress.service';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import {ScanTrigger} from 'app/shared/enum/scanTrigger.enum';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnNewInboxCount = new EventEmitter();

  displayedColumns = ['position', 'details', 'name', 'barcode', 'count', 'status'];
  dataSource: MatTableDataSource<any>;

  pageSize = 10;
  total;

  trigger = ScanTrigger.Inbox;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  socketObserver: any = null;

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socketService: SocketService,
    private progressService: ProgressService) {
  }

  ngOnInit() {
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
    this.progressService.enable();

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'Inbox',
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
      this.OnNewInboxCount.emit(this.total);
    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا به هنگام دریافت لیست سفارشات');
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
    if (this.socketObserver)
      this.socketObserver.unsubscribe();
  }

}
