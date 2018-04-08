import {Component, Input, OnInit} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.css']
})
export class PlacementComponent implements OnInit {
  @Input() isApp = false;
  @Input() pageId = null;
  @Input() placements: IPlacement[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  getRelatedPlacements(type) {
    return this.placements ? this.placements.filter(el => el.component_name.toLowerCase() === type.toLowerCase()) : [];
  }
}
