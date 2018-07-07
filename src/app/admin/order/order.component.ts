import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../shared/services/title.service';
import {MatDialog} from '@angular/material';
import {TicketComponent} from './components/ticket/ticket.component';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  newInboxCount: number;
  newDeliverCount: number;
  isSalesManager = false;

  constructor(private dialog: MatDialog, private titleService: TitleService, private authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.userDetails.accessLevel === 1)
      this.isSalesManager = true;
    this.titleService.setTitleWithOutConstant('ادمین: سفارش‌ها');
  }


}
