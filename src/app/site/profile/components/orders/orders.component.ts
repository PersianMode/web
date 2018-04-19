import { Component, OnInit } from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import * as moment from 'jalali-moment';
import {Router} from '@angular/router';
import {dateFormatter} from '../../../../shared/lib/dateFormatter';
import {ResponsiveService} from '../../../../shared/services/responsive.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  profileOrder = [];
  displayedColumns = ['col_no', 'date', 'order_lines', 'total_amount', 'used_point', 'address', 'view_details'];
  isMobile = false;
  constructor(private profileOrderService: ProfileOrderService, private router: Router, private responsiveService: ResponsiveService) {
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

  goToOrderLines() {
    this.router.navigate([`/profile/orderlines`]);
  }


}
