import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatPaginator, MatSort, MatDialog} from '@angular/material';
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as moment from 'jalali-moment';

import {OrderAddressComponent} from 'app/admin/order/components/order-address/order-address.component';
import {ProductViewerComponent} from 'app/admin/order/components/product-viewer/product-viewer.component';
import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
import {ORDERS} from 'app/admin/order/components/order-mock';
@Component({
  selector: 'app-customer-send-box',
  templateUrl: './customer-send-box.component.html',
  styleUrls: ['./customer-send-box.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CustomerSendBoxComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['position', 'customer', 'order_time', 'total_order_lines', 'address', 'used_balance', 'process_order'];
  expandedElement: any;

  pageSize = 10;
  resultsLength: Number;
  showBarcodeScanner = false;


  constructor(private dialog: MatDialog) { }
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataSource = new MatTableDataSource<any>(ORDERS);
    this.resultsLength = this.dataSource.data.length;
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
