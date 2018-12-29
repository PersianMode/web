import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar} from '@angular/material';
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as moment from 'jalali-moment';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {DeliveryStatuses} from '../../../../shared/lib/status';
import {OrderLinesComponent} from '../../../../site/profile/components/order-lines/order-lines.component';
import {OrderLineViewerComponent} from '../order-line-viewer/order-line-viewer.component';

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

  displayedColumns = ['position', 'shelf_code',  'status' , 'category' ];
  //'order_details',,
  //
  expandedElement: any;
  total;
  pageSize = 10;
  resultsLength: Number;
  showBarcodeScanner = false;
  transfereeCtrl = new FormControl();
  shelfCodeCtrl = new FormControl();
  statusList = {internalMessage: 'داخلی', externalMessage: 'خارجی'}
  _status = null;
  filteredShelfCodes: Observable<any[]>;
  shelfCodes = null;
  transferee = null;
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

    this.transfereeCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.transferee = data.trim() !== '' ? data.trim() : null;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when receiver name is changed: ', err);
      }
    );

    this.shelfCodeCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.shelfCodes = data.trim() !== '' ? data.trim() : null;
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
      shelfCodes: this.shelfCodes,

      type: 'ShelvesList',
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/DeliveryTicket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();
      console.log('res: ', res);
      const rows = [];

      if (this._status === true) {
        res = new MatTableDataSource(res.data.filter(el => el.to.warehouse_id));
      }

      if (this._status === false) {
        res = new MatTableDataSource(res.data.filter(el => el.to.customer));
      }

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

  getProductDetail(orderLines) {
    const product_color = orderLines.product_colors.find(x => x._id === orderLines.instance.product_color_id);
    const thumbnailURL = (product_color && product_color.image && product_color.image.thumbnail) ?
      imagePathFixer(product_color.image.thumbnail, orderLines.instance.product_id, product_color._id) :
      null;
    return {
      name: orderLines.instance.product_name,
      thumbnailURL,
      color: product_color ? product_color.name : null,
      color_code: product_color ? product_color.code : null,
      size: orderLines.instance.size,
      product_id: orderLines.instance.product_id
    };
  }

  showDetail(orderLines) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLines)
    });
  }


  showOrderLine(orderLines) {
    // orderLines.map(x => x)
    this.dialog.open(OrderLineViewerComponent, {
      width: '800px',
      data: this.getProductDetail(orderLines)
    });
  }

  onMismatchDetected() {
    this.progressService.enable();
  }

  onScanOrder() {
    this.showBarcodeScanner = true;
  }

  getStatus(status) {
    return DeliveryStatuses.find(x => x.status === status).name || '-';
  }

  getCategory(category) {
    if(category.customer)
      return this.statusList.externalMessage;
    else if (category.warehouse_id)
      return this.statusList.internalMessage;
  }

  changeStatus() {
    if (this._status === null) {
      this.load();
      this._status = true;
    } else if (this._status === true) {
      this.load();
      this._status = false;
    } else if (this._status === false) {
      this.load();
      this._status = null;
    }
  }
}

