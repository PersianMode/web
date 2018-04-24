import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Router} from '@angular/router';
import {dateFormatter} from '../../../../shared/lib/dateFormatter';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {MatDialog} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {MatPaginator} from '@angular/material';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  profileOrder = [];
  displayedColumns = ['col_no', 'date', 'order_lines', 'total_amount', 'used_point', 'address', 'view_details'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isMobile = false;
  selectedOrder;
  constructor(private profileOrderService: ProfileOrderService, private router: Router,
              private responsiveService: ResponsiveService,
              private dialog: MatDialog, protected httpService: HttpService,
              protected progressService: ProgressService) {
    this.isMobile = this.responsiveService.isMobile;
  }

  ngOnInit() {
    this.profileOrderService.orderArray.subscribe(result => {
      if (!result.length)
        return;
      this.profileOrder = result;
      this.profileOrder.forEach(el => [el.jalali_date, el.time] = dateFormatter(el.order_time));
    });
    this.profileOrderService.getAllOrders();
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    // this.ngAfterViewInit();
  }
  //
  // ngAfterViewInit() {
  //   this.profileOrder.paginator = this.paginator;
  // }

  makePersianNumber(a: string, isPrice) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: isPrice});
  }

  goToOrderLines(orderId) {
    this.selectedOrder = {
      orderId: orderId,
      dialog_order: this.profileOrder.find(el => el._id === orderId),
    };
    this.profileOrderService.orderData = this.selectedOrder;
    if (this.responsiveService.isMobile) {
      this.router.navigate([`/profile/orderlines`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '700px',
        data: {
          componentName: DialogEnum.orderLinesComponent,
        }
      });
    }
  };

  ngOnDestroy() {
  };
}

