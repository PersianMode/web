import {Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../../../shared/services/http.service';
import {SocketService} from '../../../../../../shared/services/socket.service';
import {OrderStatus} from '../../../../../../shared/lib/order_status';
import {STATUS} from '../../../../../../shared/enum/status.enum';
import {ProductViewerComponent} from '../../../product-viewer/product-viewer.component';
import {ProgressService} from '../../../../../../shared/services/progress.service';
import {imagePathFixer} from '../../../../../../shared/lib/imagePathFixer';



@Component({
  selector: 'app-shop-ready-to-send',
  templateUrl: './shop-ready-to-send.component.html',
  styleUrls: ['./shop-ready-to-send.component.css']
})
export class ShopReadyToSendComponent implements OnInit {
  @Output() OnNewInboxCount = new EventEmitter();

  scanDisplayedColumns = ['position', 'details', 'name', 'barcode', 'count', 'status', 'process'];

  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  pageSize = 10;
  scanTotal: boolean;

  isInvoicing = false;


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
    this.dataSource = new MatTableDataSource<any>(MOCK_DATA);
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

const MOCK_DATA = [{
  '_id': '5b6ff00001f471001c3635b9',
  'order_id': '5b7aa143ea19cc9eaf57840f',
  'order_time': '2018-08-20T11:09:40.436Z',
  'order_line_id': '5b7aa16847b021001c078246',
  'adding_time': '2018-08-20T11:09:28.257Z',
  'tickets': [{
    'is_processed': false,
    '_id': '5b7aa17447b021001c07824d',
    'status': 1,
    'desc': null,
    'receiver_id': '5b6e6c4a486ddf00066decab',
    'timestamp': '2018-08-20T11:09:40.462Z'
  }],
  'product_colors': [{
    'image': {
      'angles': ['899788-010-PHSFH001-2000.jpg'],
      'thumbnail': '899788-010-PHSBH001-2000.jpg'
    },
    '_id': '5b6ff00001f471001c3635b6',
    'color_id': '5b6a957c7b0420001ce5087c',
    'name': 'BLACK/GYM RED/ANTHRACITE',
    'code': '010'
  }, {
    'image': {
      'angles': ['899788-091-PHSFH001-2000.jpg'],
      'thumbnail': '899788-091-PHSBH001-2000.jpg'
    },
    '_id': '5b6ff00101f471001c3635fe',
    'color_id': '5b6a957c7b0420001ce50e66',
    'name': 'CARBON HEATHER/SUMMIT WHITE/BLACK',
    'code': '091'
  }],
  'total_order_lines': null,
  'instance': {
    '_id': '5b6ff00001f471001c3635b9',
    'product_id': '5b6ff000d81843b40eb9b7e3',
    'product_name': 'JSW TECH S/S TOP',
    'barcode': '826220737652',
    'size': 'L',
    'product_color_id': '5b6ff00001f471001c3635b6'
  },
  'count': 1,
  'index': 1
}, {
  '_id': '5b6ff00801f471001c36546b',
  'order_id': '5b7aa1aeea19cc9eaf57857b',
  'order_time': '2018-08-20T11:11:23.867Z',
  'order_line_id': '5b7aa1bc47b021001c07826d',
  'adding_time': '2018-08-20T11:10:52.426Z',
  'tickets': [{
    'is_processed': false,
    '_id': '5b7aa1db47b021001c07827e',
    'status': 1,
    'desc': null,
    'receiver_id': '5b6e6c4a486ddf00066decab',
    'timestamp': '2018-08-20T11:11:23.929Z'
  }],
  'product_colors': [{
    'image': {
      'angles': ['907324-001-PHCFH001-2000.jpg', '907324-001-PHCTH000-2000.jpg', '907324-001-PHSBH200-2000.jpg', '907324-001-PHSLH000-2000.jpg', '907324-001-PHSLH001-2000.jpg', '907324-001-PHSLH200-2000.jpg', '907324-001-PHSRH000-2000.jpg', '907324-001-PHSUH000-2000.jpg'],
      'thumbnail': '907324-001-PHCBH000-2000.jpg'
    },
    '_id': '5b6ff00801f471001c365468',
    'color_id': '5b6a957c7b0420001ce50fe0',
    'name': 'BLACK/BLACK-BLACK-OBSIDIAN',
    'code': '001'
  }],
  'total_order_lines': null,
  'instance': {
    '_id': '5b6ff00801f471001c36546b',
    'product_id': '5b6ff008d81843b40eb9e003',
    'product_name': 'AIR ZOOM STRUCTURE 21 SHIELD',
    'barcode': '675911622339',
    'size': '10',
    'product_color_id': '5b6ff00801f471001c365468'
  },
  'count': 1,
  'index': 2
}, {
  '_id': '5b6fefea01f471001c35d249',
  'order_id': '5b9d10e93a02315ff7ab8841',
  'order_time': '2018-09-15T14:40:19.441Z',
  'order_line_id': '5b9d10e9c7f20600252979d0',
  'adding_time': '2018-09-15T14:02:17.639Z',
  'tickets': [{
    'is_processed': false,
    '_id': '5b9d19d3c7f20600252979dc',
    'status': 1,
    'desc': null,
    'receiver_id': '5b6e6c4a486ddf00066decab',
    'timestamp': '2018-09-15T14:40:19.609Z'
  }],
  'product_colors': [{
    'image': {
      'angles': ['883735-471-PHSFH001-2000.jpg'],
      'thumbnail': '883735-471-PHSBH001-2000.jpg'
    },
    '_id': '5b6fefea01f471001c35d246',
    'color_id': '5b6a957c7b0420001ce50971',
    'name': 'THUNDER BLUE/SAIL',
    'code': '471'
  }],
  'total_order_lines': null,
  'instance': {
    '_id': '5b6fefea01f471001c35d249',
    'product_id': '5b6fefead81843b40eb938f1',
    'product_name': 'W NSW GYM VNTG TANK',
    'barcode': '887229680271',
    'size': 'L',
    'product_color_id': '5b6fefea01f471001c35d246'
  },
  'count': 1,
  'index': 3
}];
