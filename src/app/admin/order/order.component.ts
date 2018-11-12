import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../shared/services/title.service';
import { MatDialog } from '@angular/material';
import { TicketComponent } from './components/ticket/ticket.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {


  newInboxCount: number;
  newOutboxCount: number;
  readyToScanCount: number;
  newDeliverCount: number;
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

    this.titleService.setTitleWithOutConstant('ادمین: سفارش‌ها');
  }


}
