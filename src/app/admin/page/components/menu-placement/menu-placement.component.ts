import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';

@Component({
  selector: 'app-menu-placement',
  templateUrl: './menu-placement.component.html',
  styleUrls: ['./menu-placement.component.css']
})
export class MenuPlacementComponent implements OnInit {
  @Input() isApp = false;
  @Input() address = '';
  @Input() pageId = null;
  @Input() canEdit = true;

  @Input()
  set placements(value: IPlacement[]) {
    if (value) {
      this.topMenuItems = value.filter(el => el.variable_name.toLowerCase() === 'topmenu');
      this.topMenuItems.sort((a, b) => {
        a = a.info.column;
        b = b.info.column;

        if (a > b)
          return 1;
        else if (a < b)
          return -1;
        return 0;
      });
      this.subMenuItems = value.filter(el => el.variable_name.toLowerCase() === 'submenu' && el.end_date === undefined);
    }
  }

  @Output() modifyPlacement = new EventEmitter();
  @Output() selectToRevert = new EventEmitter();

  topMenuItems: IPlacement[] = [];
  subMenuItems: IPlacement[] = [];

  selectedSection = null;

  constructor() {
  }

  ngOnInit() {
  }

  modify(value) {
    this.modifyPlacement.emit(value);
  }

  showSubMenu(value) {
    this.selectedSection = value || null;
  }

  validAddress() {
    return this.address.toLowerCase() === 'my_shop';
  }

  passToRevert(value) {
    this.selectToRevert.emit(value);
  }
}
