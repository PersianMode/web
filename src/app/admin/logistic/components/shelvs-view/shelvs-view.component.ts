import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as moment from 'jalali-moment';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map, debounceTime} from 'rxjs/operators';
import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {DeliveryStatuses} from '../../../../shared/lib/status';
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() OnNewInboxCount = new EventEmitter();

  displayedColumns = ['position', 'shelf_code', 'status', 'category'];
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

    this.transfereeCtrl.valueChanges.pipe(debounceTime(500)).subscribe(
      data => {
        this.transferee = data.trim() !== '' ? data.trim() : null;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when receiver name is changed: ', err);
      }
    );

    this.shelfCodeCtrl.valueChanges.pipe(debounceTime(500)).subscribe(
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

      for (let delivery of res.data) {
        const order_data = [];
        let order_details = delivery.order_details;
        let order_lines = delivery.order_lines;
        order_lines.forEach(x => {
          let foundOrder = order_details.find(y => y.order_line_ids === x.order_lines_id);
          let preOrderData = order_data.find(y => y.order_id === foundOrder.order_id)
          if (preOrderData) {
            preOrderData.order_lines.push(x)
          } else {
            order_data.push(Object.assign(foundOrder, {order_lines: [x]}));
          }
        });

        delivery.orders = order_data;
      }

      console.log('deliveries', res.data);

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

  showOrderLine(orderLines) {
    this.dialog.open(OrderLineViewerComponent, {
      width: '800px',
      height: '400px',
      autoFocus: false,
      data: orderLines
    });
  }

  onMismatchDetected() {
    this.progressService.enable();
  }

  getStatus(status) {
    return DeliveryStatuses.find(x => x.status === status).name || '-';
  }

  getCategory(category) {
    if (category.customer)
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

