import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Router} from '@angular/router';
import {dateFormatter} from '../../../../shared/lib/dateFormatter';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {MatDialog} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  profileOrder = [];
  displayedColumns = ['col_no', 'date', 'order_lines', 'total_amount', 'used_point', 'address', 'view_details'];
  isMobile = false;
  selectedOrder;
  offset = 0;
  limit = 8;
  totalOrders: number = null;
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
  }

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


  searching() {
    this.progressService.enable();
    const data = Object.assign({
      offset: this.offset ? this.offset : 0,
      limit: this.limit ? this.limit : 8,
    });

    this.httpService.get('/orders', data).subscribe(
      (res) => {
        this.totalOrders = res.total ? parseInt(res.total, 10) : 0;
        this.progressService.disable();
      }, (err) => {
        console.log('err', err);
        this.progressService.disable();
      }
    );
  };
  changeOffset(data) {
    this.limit = data.pageSize ? data.pageSize : 10;
    this.offset = data.pageIndex * this.limit;
    this.searching();
  };

  ngOnDestroy() {
  };
}

