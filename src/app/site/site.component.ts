import { Component, OnInit } from '@angular/core';
import {WindowService} from '../shared/services/window.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;

  constructor(private windowService: WindowService) { }

  ngOnInit() {
    this.curWidth = this.windowService.getWindow().innerWidth;
    this.curHeight = this.windowService.getWindow().innerHeight;

    this.windowService.getWindow().onresize = (e) => {
      this.curWidth = this.windowService.getWindow().innerWidth;
      this.curHeight = this.windowService.getWindow().innerHeight;
    };
  }

}
