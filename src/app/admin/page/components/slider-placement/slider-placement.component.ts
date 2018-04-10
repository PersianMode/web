import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-slider-placement',
  templateUrl: './slider-placement.component.html',
  styleUrls: ['./slider-placement.component.css']
})
export class SliderPlacementComponent implements OnInit {
  @Input() placements = [];
  @Output() modifyPlacement = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
