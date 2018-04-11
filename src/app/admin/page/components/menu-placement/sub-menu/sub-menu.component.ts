import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../../shared/services/progress.service';

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
  filteredSubMenuItems: IPlacement[] = [];
  selectedSection: any = null;

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
              private progressService: ProgressService) {
  }

  ngOnInit() {
  }

  getRelatedItems() {
    this.filteredSubMenuItems = this.subMenuItems.filter(el => {
      if (el.info.section.split('/')[0].toLowerCase() === this.selectedSection.toLowerCase())
        return el;
    });
  }
}
