import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {OrderStatus} from '../../../../shared/lib/order_status';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {STATUS} from '../../../../shared/enum/status.enum';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit {


  displayedColumns = [
    'position',
    'name',
    'color',
    'is_collect',
    'size',
    'barcode',
    'price',
    'used_point',
    'used_balance',
    'customer',
    'address',
    'status'
  ];

  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;

  pageSize = 20;

  processDialogRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private httpService: HttpService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private  authService: AuthService,
              private  socketService: SocketService) {
  }

  ngOnInit() {
    this.load();

    this.socketService.getOrderLineMessage().subscribe(msg => {
      if (this.processDialogRef)
        this.processDialogRef.close();

      this.load();
    });
  }

  load() {
    this.isLoadingResults = true;

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      output: true
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Order', {options, offset, limit}).subscribe(res => {
      this.isLoadingResults = false;
      this.resultsLength = res.total;
      this.dataSource.data = res.data;
      console.log('-> ', this.dataSource.data);
    }, err => {
      this.isLoadingResults = false;
      this.resultsLength = 0;
      this.openSnackBar('خطا در دریافت لیست سفارش ها');
    });
  }


  getIndex(element) {
    return this.dataSource.data.indexOf(element) + 1;
  }

  getColor(element) {
    const color = element.product_colors.find(x => x._id === element.instance.product_color_id);
    return color ? color.name : 'نامشخص';

  }

  getStatus(element) {

    const orderStatus = OrderStatus.find(x => x.status === element.tickets.status);
    return orderStatus ? orderStatus.name : 'نامشخص';

  }

  showAddress(element) {
    let warehouse;
    let address = '';

    if (!element.address_id) {
      this.openSnackBar('order line has no address !');
      return;
    }
    if (!!element.is_collect) {
      warehouse = this.authService.warehouses.find(x => x.address._id === element.address_id);
      if (!warehouse) {
        this.openSnackBar('warehouse not found!');
        return;
      }
      address = warehouse.address;
    } else {
      address = element.customer.addresses.find(x => x._id === element.address_id);
    }


    this.processDialogRef = this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address, is_collect: !!element.is_collect}
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

}
