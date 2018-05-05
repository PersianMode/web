import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-upload',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  newInboxCount: number;
  newDeliverCount: number;

  constructor( private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین : سفارش ها');
  }

}
