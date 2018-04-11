import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-page-content-placement',
  templateUrl: './page-content-placement.component.html',
  styleUrls: ['./page-content-placement.component.css']
})
export class PageContentPlacementComponent implements OnInit {
  @Input() placements = [];
  @Output() modifyPlacement = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
