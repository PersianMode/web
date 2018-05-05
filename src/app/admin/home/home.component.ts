import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private titleSerivce: TitleService) {
  }

  ngOnInit() {
    this.titleSerivce.setTitleWithOutConstant('ادمین');
  }

}
