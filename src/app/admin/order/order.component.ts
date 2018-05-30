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
  newDeliverCount: number;

  constructor( private dialog: MatDialog, private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: سفارش‌ها');
  }

  // showModal() {
  //   const _orderId = '5b0c03fdc923734254c99e01';
  //   const _orderLineId = '5b0c03fdc923734254c99e05';
  //   this.dialog.open(TicketComponent, {
  //       width: '1000px',
  //       data: {_orderId, _orderLineId}
  //   });
  // }

}
