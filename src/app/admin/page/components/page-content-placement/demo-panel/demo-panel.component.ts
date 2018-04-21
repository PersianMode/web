import {Component, Input, OnInit} from '@angular/core';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-demo-panel',
  templateUrl: './demo-panel.component.html',
  styleUrls: ['./demo-panel.component.css']
})
export class DemoPanelComponent implements OnInit {
  @Input()
  set placements(value) {
    if (value)
      this.arrangePlacements(value);
  }

  modifiedPlacements = [];
  verticalBagName = 'page-panel-bag';
  rowBagName = 'page-panel-row-bag';

  constructor(private dragulaService: DragulaService) {
  }

  ngOnInit() {
    // if (!this.dragulaService.find(this.verticalBagName))
    //   this.dragulaService.setOptions(this.verticalBagName, {
    //     direction: 'vertical',
    //   });

    // if (!this.dragulaService.find(this.rowBagName))
    //   this.dragulaService.setOptions(this.rowBagName, {});
    //
    // this.dragulaService.dropModel.subscribe((value) => {
    //   if (this.verticalBagName === value[0])
    //     this.changeItemOrder(false);
    //   else if (this.rowBagName === value[0])
    //     this.changeItemOrder(true);
    // });
  }

  arrangePlacements(placementList) {
    this.modifiedPlacements = [];
    placementList.forEach(el => {
      if (this.modifiedPlacements.length < el.info.row)
        this.modifiedPlacements.push([]);
      this.modifiedPlacements[el.info.row - 1].push(el);
    });
  }

  changeItemOrder(inRow = false) {
    console.log('inRow: ', inRow);
  }
}
