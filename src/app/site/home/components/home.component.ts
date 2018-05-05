import {Component, OnInit} from '@angular/core';
import {PageService} from '../../../shared/services/page.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private pageService: PageService, private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('خانه');
    this.pageService.getPage('home');
  }
}
