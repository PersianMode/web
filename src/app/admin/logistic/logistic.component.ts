import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../shared/services/title.service';
import { MatDialog } from '@angular/material';
import { TicketComponent } from './components/ticket/ticket.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-logistic',
  templateUrl: './logistic.component.html',
  styleUrls: ['./logistic.component.css']
})

export class LogisticComponent implements OnInit {


  InboxCount: number;
  InternalDeliveryBoxCount: number;
  UnassignedInternalDeliveryCount: number;

  isSalesManager = false;
  isHubClerk = false;
  isShopClerk = false;
  isCentralStore = false;

  constructor( private dialog: MatDialog, private titleService: TitleService, private authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.userDetails.access_level === 1 ) {
      this.isSalesManager = true;
    }
    if (this.authService.userDetails.access_level === 2 ) {
      this.isShopClerk = true;
    }
    if (this.authService.userDetails.access_level === 3 ) {
      this.isHubClerk = true;
    }
    // you must to check central store
    const is_central_warehouse = this.authService.warehouses.filter(w => !w.has_customer_pickup && !w.is_hub)[0]._id;
    if (is_central_warehouse === this.authService.userDetails.warehouse_id) {
      this.isCentralStore = true;
    }

    this.titleService.setTitleWithOutConstant('ادمین: سفارش‌ها');
  }


}
