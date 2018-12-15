import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator, MatSort, MatDialog} from '@angular/material';
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as moment from 'jalali-moment';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {ORDERS} from '../order-mock';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
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
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['position', 'customer', 'order_time', 'total_order_lines', 'address', 'used_balance'];
  expandedElement: any;

  pageSize = 10;
  resultsLength: Number;
  showBarcodeScanner = false;
  trackingCodeCtrl = new FormControl();
  transfereeCtrl = new FormControl();
  shelfCodeCtrl = new FormControl();


  filteredShelfCodes: Observable<any[]>;
  shelfCodes = SHELF_CODES; // mock


  constructor(private dialog: MatDialog) {
    this.shelfCodeCtrl = new FormControl();
    this.filteredShelfCodes = this.shelfCodeCtrl.valueChanges
      .pipe(
        startWith(''),
        map(shelf => shelf ? this.filterShelfCodes(shelf) : this.shelfCodes.slice())
      );
   }
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataSource = new MatTableDataSource<any>(ORDERS);
    this.resultsLength = this.dataSource.data.length;
  }

  filterShelfCodes(code: string) {
    return this.shelfCodes.filter(shelf =>
      shelf.code.toLowerCase().indexOf(code.toLowerCase()) === 0);
  }

  onSortChange($event: any) {
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  onPageChange($event: any) {
    this.loadData();
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

  onMismatchDetected() {
    //
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