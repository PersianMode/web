import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../shared/services/http.service';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import {merge} from 'rxjs/observable/merge';
import {of as observableOf} from 'rxjs/observable/of';
import {catchError} from 'rxjs/operators/catchError';
import {map} from 'rxjs/operators/map';
import {startWith} from 'rxjs/operators/startWith';
import {switchMap} from 'rxjs/operators/switchMap';
import {OrderStatus} from '../../shared/lib/order_status';
import {AuthService} from '../../shared/services/auth.service';
import {OrderAddressComponent} from './components/order-address/order-address.component';
import {OrderProcessComponent} from './components/order-process/order-process.component';
import {AccessLevel} from '../../shared/enum/accessLevel.enum';
import {STATUS} from '../../shared/enum/status.enum';

@Component({
  selector: 'app-upload',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderLines: any = [];

  displayedColumns = ['position', 'name', 'color', 'is_collect', 'size', 'barcode', 'price', 'customer', 'address', 'status', 'process', 'delivery'];
  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;

  pageSize = 20;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private httpService: HttpService, private dialog: MatDialog, private snackBar: MatSnackBar, private  authService: AuthService) {
  }

  ngOnInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          const options = {
            sort: this.sort.active,
            dir: this.sort.direction,
          };
          const offset = this.paginator.pageIndex * +this.pageSize;
          const limit = this.pageSize;

          return this.httpService.post('search/Order', {options, offset, limit});
        }),
        map(res => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = res.total;

          console.log('-> ', res.data);

          return res.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);


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


    const dialogRef = this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address, is_collect: !!element.is_collect}
    });

  }

  process(element) {
    const dialogRef = this.dialog.open(OrderProcessComponent, {
      width: '600px',
      data: element
    });


  }

  isReadyToDeliver(element) {
    if (this.authService.userDetails.accessLevel === AccessLevel.SalesManager) {
      return element.tickets.status === STATUS.Invoice;
    } else if (this.authService.userDetails.accessLevel === AccessLevel.ShopClerk) {
      return element.tickets.status === STATUS.SCAccepted;
    }
  }

  showDelivery(element) {

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
