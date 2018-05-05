import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-upload',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  newInboxCount: number;
  newDeliverCount: number;

  constructor( private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('ادمین : سفارش ها');
  }

}
