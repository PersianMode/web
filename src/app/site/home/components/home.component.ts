import {Component, OnInit} from '@angular/core';
import {PageService} from '../../../shared/services/page.service';
import {TitleService} from '../../../shared/services/title.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private pageService: PageService, private titleService: TitleService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.titleService.setTitleWithConstant();
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('preview'))
        this.pageService.getPage(`home?preview=&date=` + params.date);
      else
        this.pageService.getPage('home');
    });
  }
}
