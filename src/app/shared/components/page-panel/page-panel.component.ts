import {Component, Input, OnInit} from '@angular/core';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-page-panel',
  templateUrl: './page-panel.component.html',
  styleUrls: ['./page-panel.component.css']
})
export class PagePanelComponent implements OnInit {
  @Input()
  set placements(value) {
    if (value)
      this.getPlacements(value);

  }

  @Input() isDraggable = true;

  bagNames = ['vertical-panel-bag', 'horizontal-panel-bag'];
  modifiedPlacements = {};

  constructor(private dragulaService: DragulaService) {
  }

  ngOnInit() {
    this.dragulaService.setOptions(this.bagNames[0], {
        direction: 'vertical',
        moves: (el, source, handle, sibling) => {
          return this.isDraggable;
        }
      }
    );

    this.dragulaService.setOptions(this.bagNames[1], {
        direction: 'horizontal',
        moves: (el, source, handle, sibling) => {
          return this.isDraggable;
        }
      }
    );

    this.dragulaService.dropModel.subscribe((value) => {
      if (this.bagNames.includes(value[0]))
        this.changePanelOrder();
    });
  }

  changePanelOrder() {
    console.log('changed order');
  }

  getPlacements(placementList) {
    this.modifiedPlacements = {};
    placementList.forEach(el => {
      console.log(el);
      // if (!this.modifiedPlacements[el.info.row])
      //   this.modifiedPlacements[el.info.row] = [];
      //
      // this.modifiedPlacements[el.info.row].push(el);
    });
  }

  getKeyList(data) {
    return Object.keys(data);
  }
}
