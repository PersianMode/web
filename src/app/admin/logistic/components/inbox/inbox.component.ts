import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {OrderLineStatuses} from '../../../../shared/lib/status';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {ProgressService} from '../../../../shared/services/progress.service';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import {ScanTrigger} from 'app/shared/enum/scanTrigger.enum';
import {AuthService} from 'app/shared/services/auth.service';
import {AccessLevel} from 'app/shared/enum/accessLevel.enum';
import {ORDER_LINE_STATUS} from 'app/shared/enum/status.enum';
import {RemovingConfirmComponent} from 'app/shared/components/removing-confirm/removing-confirm.component';
import {MismatchConfirmComponent} from '../mismatch-confirm/mismatch-confirm.component';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnNewInboxCount = new EventEmitter();

  displayedColumns = ['position', 'details', 'name', 'barcode', 'count', 'status', 'process', 'loss'];
  dataSource: MatTableDataSource<any>;

  pageSize = 10;
  total;

  trigger = ScanTrigger.Inbox;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  socketSubscription: any;
  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socketService: SocketService,
    private progressService: ProgressService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.socketSubscription = this.socketService.getOrderLineMessage().subscribe(msg => {
      this.load();
    });

  }

  ngAfterViewInit(): void {
    this.load();
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
    try {
      if (orderLine && orderLine.tickets) {
        const lastTicket = orderLine.tickets && orderLine.tickets.length ? orderLine.tickets[orderLine.tickets.length - 1] : null;
        const ticketName = OrderLineStatuses.find(x => x.status === lastTicket.status).name;
        return orderLine.cancel ? `${'لغو شده'} - ${ticketName}` : ticketName;

      }
    } catch (error) {

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


  shouldCheckProduct(orderline) {
    const isHubClerk = this.authService.userDetails.access_level === AccessLevel.HubClerk;
    const isReturnOrderLine = orderline.tickets.find(x => x.status === ORDER_LINE_STATUS.ReturnRequested);

    return isHubClerk && isReturnOrderLine;
  }

  informDamage(orderLine) {

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
      data: {
        name: 'اعلام خرابی',
        message: 'در صورت اعلام خرابی پیام به مسئول فروش جهت بررسی بیشتر ارسال خواهد شد'
      }

    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.post('order/damage', {
            orderId: orderLine.order_id,
            orderLineId: orderLine.order_line_id
          }).subscribe(res => {
            this.progressService.disable();
          }, err => {
            this.progressService.disable();
            this.openSnackBar('خطا به هنگام اعلام خرابی محصول');
          });
        }
      }, err => {
        console.log('Error in dialog: ', err);
      });


  }

  informLoss(orderLine) {

    const rmDialog = this.dialog.open(MismatchConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.post('order/loss', {
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


  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }

}
