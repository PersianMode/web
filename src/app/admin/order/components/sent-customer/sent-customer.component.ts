import {Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy} from '@angular/core';
import {TicketComponent} from '../ticket/ticket.component';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
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
  selector: 'app-sent-customer',
  templateUrl: './sent-customer.component.html',
  styleUrls: ['./sent-customer.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SentCustomerComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['position', 'customer', 'is_collect', 'order_time', 'total_order_lines', 'address', 'used_balance' ];
  expandedElement: any;

  trackingCodeCtrl = new FormControl();
  transfereeCtrl = new FormControl();
  shelfCodeCtrl = new FormControl();

  pageSize = 10;
  resultsLength: Number;



  warehouseName = null;
  agentName = null;
  isStatus = null;
  addingTime = null;



  socketObserver: any = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private httpService: HttpService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private socketService: SocketService,
              private progressService: ProgressService) {
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {
    this.loadData();
  }

  loadData() {
   this.dataSource = new MatTableDataSource<any>(MOCK_DATA);
  }

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


  showDetial(orderLine) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLine)
    });
  }


  getOrderStatus(order) {
    const _orderId = order._id;
    this.dialog.open(TicketComponent, {
      width: '1000px',
      data: {_orderId, tickeByReceiver : true}
    });
  }

  showAddress(order) {

    if (!order.address) {
      this.openSnackBar('order line has no address!');
      return;
    }

    this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address: order.address, is_collect: !!order.is_collect}
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

  showTicket(order, orderLine) {
  }
  showHistory(order, orderLine) {
  }


}
const MOCK_DATA = [{
  '_id': '5b7a926dea19cc9eaf57773e',
  'customer': {
    '_id': '5b791a142b4ce00025e9b7a6',
    'name': 'احسان',
    'surname': 'انصاری بصیر',
    'addresses': [{
      '_id': '5b79251ef6caaf001b432c9c',
      'province': 'تهران',
      'city': 'تهران',
      'street': 'دوم شرقی',
      'unit': '6',
      'no': '4',
      'district': 'چاردیواری',
      'recipient_title': 'm',
      'recipient_name': 'احسان',
      'recipient_surname': 'انصاری بصیر',
      'recipient_national_id': '0010684281',
      'recipient_mobile_no': '09125975886',
      'postal_code': null,
      'loc': {
        'long': 51.379926,
        'lat': 35.696491
      }
    }, {
      '_id': '5b9d19abc7f20600252979d1',
      'province': 'سیستان و بلوچستان',
      'city': 'ادیمی',
      'street': 'بیبی',
      'unit': '12',
      'no': '12',
      'district': 'یتاتس',
      'recipient_title': 'm',
      'recipient_name': 'احسان',
      'recipient_surname': 'انصاری بصیر',
      'recipient_national_id': '0010684281',
      'recipient_mobile_no': '09125975886',
      'postal_code': '16987459',
      'loc': {
        'long': 51.379926,
        'lat': 35.696491
      }
    }]
  },
  'last_ticket': {
    'is_processed': false,
    '_id': '5b7a972e47b021001c078227',
    'status': 7,
    'desc': null,
    'receiver_id': '5b6e6c4a486ddf00066decaa',
    'timestamp': '2018-08-20T10:25:50.672Z'
  },
  'cart_items': 'cart_items',
  'address': {
    '_id': '5b79251ef6caaf001b432c9c',
    'province': 'تهران',
    'city': 'تهران',
    'street': 'دوم شرقی',
    'unit': '6',
    'no': '4',
    'district': 'چاردیواری',
    'recipient_title': 'm',
    'recipient_name': 'احسان',
    'recipient_surname': 'انصاری بصیر',
    'recipient_national_id': '0010684281',
    'recipient_mobile_no': '09125975886',
    'postal_code': null,
    'loc': {
      'long': 51.379926,
      'lat': 35.696491
    }
  },
  'customerData': null,
  'transaction_id': 'xyz22823',
  'used_point': 0,
  'total_amount': 18,
  'total_order_lines': 1,
  'is_collect': false,
  'discount': 18,
  'used_balance': 0,
  'order_time': '2018-08-20T10:08:36.263Z',
  'product_colors': null,
  'order_lines': [{
    'order_line_id': '5b7a926d47b021001c078205',
    'tickets': {
      'is_processed': true,
      '_id': '5b7a967c47b021001c07821d',
      'status': 10,
      'desc': null,
      'receiver_id': '5b6e6c4a486ddf00066decaa',
      'timestamp': '2018-08-20T10:22:52.050Z',
      'agent_id': '5b6e6cf8486ddf00066decbb'
    },
    'product_colors': [{
      'image': {
        'angles': ['897646-006-PHCFH001-2000.jpg', '897646-006-PHCTH001-2000.jpg', '897646-006-PHSLH000-2000.jpg', '897646-006-PHSRH000-2000.jpg', '897646-006-PHSRH001-2000.jpg', '897646-006-PHSUH000-2000.jpg'],
        'thumbnail': '897646-006-PHCBH000-2000.jpg'
      },
      '_id': '5b6feffa01f471001c361bfa',
      'color_id': '5b6a957c7b0420001ce50d0b',
      'name': 'BLACK/TEAM ORANGE-WHITE-ATMOSPHERE GREY',
      'code': '006'
    }, {
      'image': {
        'angles': ['897646-101-PHCFH001-2000.jpg', '897646-101-PHCTH001-2000.jpg', '897646-101-PHSLH000-2000.jpg', '897646-101-PHSRH000-2000.jpg', '897646-101-PHSRH001-2000.jpg', '897646-101-PHSUH000-2000.jpg'],
        'thumbnail': '897646-101-PHCBH000-2000.jpg'
      },
      '_id': '5b6feffa01f471001c361c9c',
      'color_id': '5b6a957c7b0420001ce50d14',
      'name': 'WHITE/RACER BLUE-INFRARED-PURE PLATINUM',
      'code': '101'
    }],
    'instance': {
      '_id': '5b6feffa01f471001c361bfd',
      'product_id': '5b6feffad81843b40eb9954a',
      'product_name': 'LEBRON SOLDIER XI SFG',
      'barcode': '676556989184',
      'size': '10',
      'product_color_id': '5b6feffa01f471001c361bfa'
    }
  }],
  'index': 1
}, {
  'detailRow': true,
  'order': {
    '_id': '5b7a926dea19cc9eaf57773e',
    'customer': {
      '_id': '5b791a142b4ce00025e9b7a6',
      'name': 'احسان',
      'surname': 'انصاری بصیر',
      'addresses': [{
        '_id': '5b79251ef6caaf001b432c9c',
        'province': 'تهران',
        'city': 'تهران',
        'street': 'دوم شرقی',
        'unit': '6',
        'no': '4',
        'district': 'چاردیواری',
        'recipient_title': 'm',
        'recipient_name': 'احسان',
        'recipient_surname': 'انصاری بصیر',
        'recipient_national_id': '0010684281',
        'recipient_mobile_no': '09125975886',
        'postal_code': null,
        'loc': {
          'long': 51.379926,
          'lat': 35.696491
        }
      }, {
        '_id': '5b9d19abc7f20600252979d1',
        'province': 'سیستان و بلوچستان',
        'city': 'ادیمی',
        'street': 'بیبی',
        'unit': '12',
        'no': '12',
        'district': 'یتاتس',
        'recipient_title': 'm',
        'recipient_name': 'احسان',
        'recipient_surname': 'انصاری بصیر',
        'recipient_national_id': '0010684281',
        'recipient_mobile_no': '09125975886',
        'postal_code': '16987459',
        'loc': {
          'long': 51.379926,
          'lat': 35.696491
        }
      }]
    },
    'last_ticket': {
      'is_processed': false,
      '_id': '5b7a972e47b021001c078227',
      'status': 7,
      'desc': null,
      'receiver_id': '5b6e6c4a486ddf00066decaa',
      'timestamp': '2018-08-20T10:25:50.672Z'
    },
    'cart_items': 'cart_items',
    'address': {
      '_id': '5b79251ef6caaf001b432c9c',
      'province': 'تهران',
      'city': 'تهران',
      'street': 'دوم شرقی',
      'unit': '6',
      'no': '4',
      'district': 'چاردیواری',
      'recipient_title': 'm',
      'recipient_name': 'احسان',
      'recipient_surname': 'انصاری بصیر',
      'recipient_national_id': '0010684281',
      'recipient_mobile_no': '09125975886',
      'postal_code': null,
      'loc': {
        'long': 51.379926,
        'lat': 35.696491
      }
    },
    'customerData': null,
    'transaction_id': 'xyz22823',
    'used_point': 0,
    'total_amount': 18,
    'total_order_lines': 1,
    'is_collect': false,
    'discount': 18,
    'used_balance': 0,
    'order_time': '2018-08-20T10:08:36.263Z',
    'product_colors': null,
    'order_lines': [{
      'order_line_id': '5b7a926d47b021001c078205',
      'tickets': {
        'is_processed': true,
        '_id': '5b7a967c47b021001c07821d',
        'status': 10,
        'desc': null,
        'receiver_id': '5b6e6c4a486ddf00066decaa',
        'timestamp': '2018-08-20T10:22:52.050Z',
        'agent_id': '5b6e6cf8486ddf00066decbb'
      },
      'product_colors': [{
        'image': {
          'angles': ['897646-006-PHCFH001-2000.jpg', '897646-006-PHCTH001-2000.jpg', '897646-006-PHSLH000-2000.jpg', '897646-006-PHSRH000-2000.jpg', '897646-006-PHSRH001-2000.jpg', '897646-006-PHSUH000-2000.jpg'],
          'thumbnail': '897646-006-PHCBH000-2000.jpg'
        },
        '_id': '5b6feffa01f471001c361bfa',
        'color_id': '5b6a957c7b0420001ce50d0b',
        'name': 'BLACK/TEAM ORANGE-WHITE-ATMOSPHERE GREY',
        'code': '006'
      }, {
        'image': {
          'angles': ['897646-101-PHCFH001-2000.jpg', '897646-101-PHCTH001-2000.jpg', '897646-101-PHSLH000-2000.jpg', '897646-101-PHSRH000-2000.jpg', '897646-101-PHSRH001-2000.jpg', '897646-101-PHSUH000-2000.jpg'],
          'thumbnail': '897646-101-PHCBH000-2000.jpg'
        },
        '_id': '5b6feffa01f471001c361c9c',
        'color_id': '5b6a957c7b0420001ce50d14',
        'name': 'WHITE/RACER BLUE-INFRARED-PURE PLATINUM',
        'code': '101'
      }],
      'instance': {
        '_id': '5b6feffa01f471001c361bfd',
        'product_id': '5b6feffad81843b40eb9954a',
        'product_name': 'LEBRON SOLDIER XI SFG',
        'barcode': '676556989184',
        'size': '10',
        'product_color_id': '5b6feffa01f471001c361bfa'
      }
    }],
    'index': 1
  }
}];
