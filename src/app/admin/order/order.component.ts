import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../shared/services/title.service';
import { MatDialog } from '@angular/material';
import { TicketComponent } from './components/ticket/ticket.component';

@Component({
  selector: 'app-upload',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {


  newInboxCount: number;
  newOutboxCount: number;
  readyToScanCount: number;

  constructor( private dialog: MatDialog, private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: سفارش‌ها');
  }


}
