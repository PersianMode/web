import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../shared/services/window.service';


@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
  curWidth = 100;
  curHeight = 100;

  constructor(@Inject(WINDOW) private window) {
  }

  ngOnInit() {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;

    this.window.onresize = (e) => {
      this.curWidth = this.window.innerWidth;
      this.curHeight = this.window.innerHeight;
    };
  }

}
