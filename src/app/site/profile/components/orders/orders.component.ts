import { Component, OnInit } from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import * as moment from 'jalali-moment';
import {Router} from '@angular/router';
import {dateFormatter} from '../../../../shared/lib/dateFormatter';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  profileOrder;
  displayedColumns = ['col_no', 'order_code', 'date', 'total_amount', 'order_lines', 'address', 'view_details'];
  m = 1231223;
  constructor(private profileOrderService: ProfileOrderService, private router: Router) { }

  ngOnInit() {

    this.profileOrderService.orderArray.subscribe(result => {
      if (!result.length)
        return;
      this.profileOrder = result;
      this.profileOrder.forEach(el => [el.jalali_date, el.time] = dateFormatter(el.order_time) )
      console.log('--->', this.profileOrder);
      console.log('--->', this.profileOrder.length);
    });
    this.profileOrderService.getAllOrders();
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }

  goToOrderLines() {
    this.router.navigate([`/profile/orderlines`]);
  }


}
