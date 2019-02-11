import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {OrderLineStatuses} from '../../../../shared/lib/status';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {BarcodeCheckerComponent} from '../barcode-checker/barcode-checker.component';
import {ProgressService} from '../../../../shared/services/progress.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import * as moment from 'jalali-moment';
import {TicketComponent} from '../ticket/ticket.component';
import {SMMessageTypes} from 'app/shared/enum/sm_message';
import {ReturnDeliveryGeneratorComponent} from './components/return-delivery-generator/return-delivery-generator.component';
import {SmReportComponent} from './components/sm-report/sm-report.component';

@Component({
  selector: 'app-sm-inbox',
  templateUrl: './sm-inbox.component.html',
  styleUrls: ['./sm-inbox.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SmInboxComponent implements OnInit, AfterViewInit, OnDestroy {


  @Output() OnNewSMInboxCount = new EventEmitter();

  displayedColumns = [
    'position',
    'customer',
    'publish_date',
    'desc',
    'status',
    'process',
    'close'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  pageSize = 10;
  total;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  socketSubscription: any = null;

  expandedElement: any;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socketService: SocketService,
    private progressService: ProgressService) {

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

    this.expandedElement = null;

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'SMInbox'
    };

    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/SMMessage', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();

      const rows = [];
      res.data.forEach((message, index) => {
        message['position'] = index + 1;
        rows.push(message, {detailRow: true, message});
      });
      this.dataSource.data = rows;
      this.total = res.total ? res.total : 0;
      this.total = res.total || 0;
      this.OnNewSMInboxCount.emit(this.total);

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا درد دریافت لیست پیام های مسئول فروش');
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

  getProductDetail(message) {
    const product_color = message.instance.product_colors.find(x => x._id === message.instance.product_color_id);
    const thumbnailURL = (product_color && product_color.image && product_color.image.thumbnail) ?
      imagePathFixer(product_color.image.thumbnail, message.instance.product_id, product_color._id) :
      null;
    return {
      name: message.instance.product_name,
      thumbnailURL,
      color: product_color ? product_color.name : null,
      color_code: product_color ? product_color.code : null,
      size: message.instance.size,
      product_id: message.instance.product_id
    };
  }


  getCustomer(message) {
    try {
      if (message.customer)
        return message.customer.first_name + ' ' + message.customer.surname;
      else

        return message.address.recipient_name + ' ' + message.address.recipient_surname;
    } catch (err) {
    }
  }

  showDetial(message) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(message)
    });
  }

  getProcessTitle(message) {
    switch (message.type) {
      case SMMessageTypes.ReturnRequest:
        return 'اختصاص ارسال';
      default:
        return '-';
    }
  }

  needsProcess(message) {
    return !message.is_processed &&
      ![
        SMMessageTypes.Damage,
        SMMessageTypes.SimpleOrderIssue,
      ].includes(message.type);

  }
  process(message) {
    let component;
    switch (message.type) {
      case SMMessageTypes.ReturnRequest:
        component = ReturnDeliveryGeneratorComponent;
        break;

      default:
        break;
    }

    this.dialog.open(component, {
      width: '700px',
      data: {
        message,
      }
    });
  }

  showDesc(message) {

  }

  close(message) {
    this.dialog.open(SmReportComponent, {
      width: '700px',
      data: {
        message,
      }
    });
  }

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }
}

