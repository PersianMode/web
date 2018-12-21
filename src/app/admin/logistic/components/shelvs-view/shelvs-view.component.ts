import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar} from '@angular/material';
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as moment from 'jalali-moment';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {ORDERS} from '../order-mock';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';




@Component({
  selector: 'app-shelvs-view',
  templateUrl: './shelvs-view.component.html',
  styleUrls: ['./shelvs-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ShelvsViewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() OnNewInboxCount = new EventEmitter();

  displayedColumns = ['position', 'customer', 'order_time', 'total_order_lines', 'trackingCode', 'address',  'shelf_code'];

  expandedElement: any;
  total;
  pageSize = 10;
  resultsLength: Number;
  showBarcodeScanner = false;
  trackingCodeCtrl = new FormControl();
  transfereeCtrl = new FormControl();
  shelfCodeCtrl = new FormControl();


  filteredShelfCodes: Observable<any[]>;
  shelfCodes = SHELF_CODES; // mock
  transferee = null;
  trackingCode = null;
  dataSource = new MatTableDataSource();

  constructor(private dialog: MatDialog, private progressService: ProgressService, private httpService: HttpService, private snackBar: MatSnackBar) {
    this.shelfCodeCtrl = new FormControl();
    this.filteredShelfCodes = this.shelfCodeCtrl.valueChanges
      .pipe(
        startWith(''),
        map(shelf => shelf ? this.filterShelfCodes(shelf) : this.shelfCodes.slice())
      );
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {
    this.load();

    this.trackingCodeCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.trackingCode = data.trim() !== '' ? data.trim() : null;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when tracking code is changed: ', err);
      }
    );

    this.transfereeCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.transferee = data.trim() !== '' ? data.trim() : null;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when receiver name is changed: ', err);
      }
    );

  }

  load() {
    this.progressService.enable();
    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,

      transferee: this.transferee,
      trackingCode: this.trackingCode,

      type: 'ShelvesList',
      manual: false
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;
    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();
      console.log('res: ', res);
      const rows = [];
      res.data.forEach((order, index) => {
        order['index'] = index + 1;
        rows.push(order, {detailRow: true, order});
      });

      this.dataSource.data = rows;

      this.resultsLength = res.total ? res.total : 0;
      this.OnNewInboxCount.emit(res.total);

    }, err => {
      this.progressService.disable();
      this.OnNewInboxCount.emit(0);
      this.openSnackBar('خطا در دریافت لیست سفارش‌ها');
    });

  }

  filterShelfCodes(code: string) {
    return this.shelfCodes.filter(shelf =>
      shelf.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  onSortChange($event: any) {
    this.paginator.pageIndex = 0;
    this.load();
  }

  onPageChange($event: any) {
    this.load();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  getDate(orderTime) {
    return moment(orderTime).format('jYYYY/jMM/jDD HH:mm:ss');
  }

  showAddress(order) {
    if (!order.address) {
      // need to create message service and return this message => ('order line has no address!)
      return;
    }
    this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address: order.address, is_collect: !!order.is_collect}
    });
  }

  getProductDetail(orderLine) {
    const product_color = orderLine.product_colors.find(x => x._id === orderLine.product_color_id);
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

  showDetail(orderLine) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLine)
    });
  }

  onMismatchDetected() {
    this.progressService.enable();
  }

  onScanOrder() {
    this.showBarcodeScanner = true;
  }
}

const SHELF_CODES = [
  {
    code: 'as23sd3',
  },
  {
    code: '99sd23',
  },
  {
    code: '023d34',
  },
  {
    code: '3sd342s',
  }
];
