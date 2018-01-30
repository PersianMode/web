import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.css']
})
export class MobileHeaderComponent implements OnInit {
  @Input() menuWidth = 100;
  @Input() menuHeight = 100;

  sideNavIsOpen = false;

  constructor() {
  }

  ngOnInit() {
  }

}
