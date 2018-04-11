import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.css']
})
export class PlacementComponent implements OnInit {
  @Input() isApp = false;
  @Input() pageId = null;

  @Input()
  set placements(value) {
    this._placements = value;
  }

  _placements: IPlacement[] = [];
  @Output() modifyPlacement = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  getRelatedPlacements(type) {
    return this._placements ? this._placements.filter(el => el.component_name.toLowerCase() === type.toLowerCase()) : [];
  }

  modify(value) {
    this.modifyPlacement.emit(value);
  }
}
