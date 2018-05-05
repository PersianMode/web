import {Component, OnInit} from '@angular/core';
import {PageService} from '../../../shared/services/page.service';
import {TitleService} from '../../../shared/services/title.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private pageService: PageService, private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitleWithConstant();
    this.pageService.getPage('home');
  }
}
