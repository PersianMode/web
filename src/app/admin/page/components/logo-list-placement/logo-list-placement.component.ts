import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-logo-list-placement',
  templateUrl: './logo-list-placement.component.html',
  styleUrls: ['./logo-list-placement.component.css']
})
export class LogoListPlacementComponent implements OnInit {
  @Input() placements = [];
  @Output() modifyPlacement = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
