import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatDialog, MatPaginator, MatSort} from '@angular/material';

import {imagePathFixer} from 'app/shared/lib/imagePathFixer';
import {ProductViewerComponent} from 'app/admin/order/components/product-viewer/product-viewer.component';
import {ORDER_LINES} from 'app/admin/order/components/order-line-mock'; // mock data based on orderlines

@Component({
  selector: 'app-return-to-warehouse-box',
  templateUrl: './return-to-warehouse-box.component.html',
  styleUrls: ['./return-to-warehouse-box.component.css']
})
export class ReturnToWarehouseBoxComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['position', 'details', 'name', 'barcode', 'count'];


  pageSize = 10;
  scanTotal;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.loadData();
  }

  onSortChange() {
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  onPageChange($event: any) {
    this.loadData();
  }

  loadData() {
    this.dataSource = new MatTableDataSource<any>(ORDER_LINES); // mock data
    this.scanTotal = this.dataSource.data.length; // (!!scanTotal) in client side can show barcode scanner when total not equal to 0
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

  onMismatchDetected() {}

}
