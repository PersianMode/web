import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../../shared/services/progress.service';

enum ItemArea {
  Header,
  Middle,
  Left,
};

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {
  @Input() pageId = null;

  @Input()
  set placements(value: IPlacement[]) {
    if (value) {
      this.subMenuItems = value;
    }
  }

  @Input()
  set section(value) {
    this.selectedSection = value || null;
    if (value)
      this.getRelatedItems();
  }

  @Output() modifyPlacement = new EventEmitter();

  subMenuItems: IPlacement[] = [];
  headerAreaItems: any = {};
  middleAreaItems: any = {};
  leftAreaItems: any = {};
  headerAreaColumns: any[] = [];
  middleAreaColumns: any[] = [];
  leftAreaColumns: any[] = [];
  selectedSection: any = null;
  itemArea = ItemArea;

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
              private progressService: ProgressService) {
  }

  ngOnInit() {
    this.dragulaService.setOptions('sub-menu-header-bag sub-menu-middle-bag sub-menu-left-bag', {
      direction: 'vertical',
    });

    // this.dragulaService.setOptions('sub-menu-middle-bag', {
    //   direction: 'vertical',
    // });
    //
    // this.dragulaService.setOptions('sub-menu-left-bag', {
    //   direction: 'vertical',
    // });

    this.dragulaService.dropModel.subscribe((value) => {
      this.changeMenuItemOrder(value.slice(1));
    });
  }

  getRelatedItems() {
    this.headerAreaItems = [];
    this.middleAreaItems = [];
    this.leftAreaItems = [];

    this.subMenuItems.filter(el => {
      if (el.info.section.split('/')[0].toLowerCase() === this.selectedSection.toLowerCase())
        return el;
    }).forEach(el => {
      const area = el.info.section.split('/')[1].toLowerCase();
      const column = el.info.column;

      switch (area) {
        case 'header': {
          if (!this.headerAreaItems[column])
            this.headerAreaItems[column] = [];

          this.headerAreaItems[column].push(el);
        }
          break;
        case 'middle': {
          if (!this.middleAreaItems[column])
            this.middleAreaItems[column] = [];

          this.middleAreaItems[column].push(el);
        }
          break;
        case 'left': {
          if (!this.leftAreaItems[column])
            this.leftAreaItems[column] = [];

          this.leftAreaItems[column].push(el);
        }
          break;
      }
    });

    Object.keys(this.headerAreaItems).forEach(el => {
      this.sortColumnItems(this.headerAreaItems[el]);
    });

    Object.keys(this.middleAreaItems).forEach(el => {
      this.sortColumnItems(this.middleAreaItems[el]);
    });

    Object.keys(this.leftAreaItems).forEach(el => {
      this.sortColumnItems(this.leftAreaItems[el]);
    });

    this.headerAreaColumns = Object.keys(this.headerAreaItems);
    this.middleAreaColumns = Object.keys(this.middleAreaItems);
    this.leftAreaColumns = Object.keys(this.leftAreaItems);
  }

  private sortColumnItems(list) {
    list.sort((a, b) => {
      if (a.row > b.row)
        return 1;
      else if (a.row < b.row)
        return -1;

      return 0;
    });
  }

  changeMenuItemOrder(data) {

  }

  selectItem() {

  }
}
