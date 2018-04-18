import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {SocketService} from '../../../../shared/services/socket.service';
import {OrderStatus} from '../../../../shared/lib/order_status';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {SMOrderProcessComponent} from '../sm-order-process/sm-order-process.component';
import {SCOrderProcessComponent} from '../sc-order-process/sc-order-process.component';
import {STATUS} from '../../../../shared/enum/status.enum';

@Component({
  selector: 'app-order-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {


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
    'status',
    'process',
    'delivery'
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

  process(element) {
    const component: any = this.authService.userDetails.accessLevel === AccessLevel.SalesManager ?
      SMOrderProcessComponent : SCOrderProcessComponent;
    const dialogRef = this.dialog.open(component, {
      width: '600px',
      data: element
    });

    dialogRef.afterClosed().subscribe((reload: boolean) => {
        if (reload)
          this.load();
      }
    );

  }

  requestForInvoice(element) {
    this.httpService.post(`order/ticket/offline/requestInvoice`, {
      orderId: element._id,
      orderLineId: element.order_line_id
    }).subscribe(res => {
      if (res && res.result === 'ok')
        this.openSnackBar('درخواست صدور فاکتور با موفقیت انجام شد');
      else
        this.openSnackBar('خطا در درخواست صدور فاکتور');
    }, err => {
      this.openSnackBar('خطا در درخواست صدور فاکتور');
    });
  }


  isReadyToDeliver(element) {
    return element.tickets.status === STATUS.ReadyToDeliver;
  }

  invoiceRequested(element) {
    return element.tickets.status === STATUS.Invoice;
  }

  showDelivery(element) {

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
