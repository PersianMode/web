import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../../shared/services/progress.service';
import {PlacementModifyEnum} from '../../../enum/placement.modify.type.enum';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  @Input() pageId = null;
  @Input()
  set placements(value: IPlacement[]) {
    if (value) {
      this.topMenuItems = value.filter(el => el.variable_name.toLowerCase() === 'topmenu');
      this.changeField();
    }
  }

  @Output() modifyPlacement = new EventEmitter();

  topMenuItems: IPlacement[] = [];
  upsertTopMenuItem = {
    text: '',
    href: '',
    id: null,
    column: null,
    isEdit: false,
  };
  topMenuChanged = false;

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
              private progressService: ProgressService) {
  }

  ngOnInit() {
    this.dragulaService.setOptions('top-menu-bag', {
      direction: 'horizontal',
    });

    this.dragulaService.dropModel.subscribe((value) => {
      this.changeTopMenuColumn(value.slice(1));
    });
  }

  removeItem() {
    this.progressService.enable();
    const index = this.topMenuItems.findIndex(
      el => el.info.text === this.upsertTopMenuItem.text && el.info.href === this.upsertTopMenuItem.href);
    if (index !== -1)
      this.httpService.post('placement/delete', {
        page_id: this.pageId,
        placement_id: this.topMenuItems[index]._id,
      }).subscribe(
        (data) => {
          this.modifyPlacement.emit({
            type: PlacementModifyEnum.Delete,
            placement_id: this.topMenuItems[index]._id,
          });
          // this.topMenuItems.splice(index, 1);
          this.upsertTopMenuItem = {
            text: '',
            href: '',
            id: null,
            column: null,
            isEdit: false,
          };
          this.progressService.disable();
        },
        (err) => {
          this.progressService.disable();
        }
      );
  }

  selectItem(value) {
    this.upsertTopMenuItem = {
      text: value.info.text,
      href: value.info.href,
      id: value._id,
      column: null,
      isEdit: true,
    };
  }

  changeTopMenuColumn(args) {
    const [element, target, source] = args;

    let counter = 0;
    Object.keys(target.children).forEach(child => {
      const obj = this.topMenuItems.find(el => el.info.text === target.children[child].innerText);
      if (obj) {
        obj.info.column = counter;
        counter++;
      }
    });

    this.progressService.enable();
    this.httpService.post('placement', {
      page_id: this.pageId,
      placements: this.topMenuItems,
    }).subscribe(
      (data) => {
        this.modifyPlacement.emit({
          type: PlacementModifyEnum.Modify,
          placements: this.topMenuItems,
        });
        this.progressService.disable();
      },
      (err) => {
        this.progressService.disable();
      }
    );
  }

  modifyItem(isEdit) {
    this.progressService.enable();
    (isEdit ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: this.upsertTopMenuItem.id,
          info: {
            text: this.upsertTopMenuItem.text,
            href: this.upsertTopMenuItem.href,
            column: this.upsertTopMenuItem.column,
          }
        }
      ]
    }) : this.httpService.put('placement', {
      page_id: this.pageId,
      placement: {
        component_name: 'menu',
        variable_name: 'topMenu',
        info: {
          text: this.upsertTopMenuItem.text,
          href: this.upsertTopMenuItem.href,
          column: Math.max(...this.topMenuItems.map(el => el.info.column)) + 1,
        },
      }
    })).subscribe(
      (data) => {
        console.log('DATA: ', data);

        this.modifyPlacement.emit({
          type: isEdit ? PlacementModifyEnum.Modify : PlacementModifyEnum.Add,
          placement_id: data._id,
          placements: [this.upsertTopMenuItem],
          placement: data.placement,
        });

        if (isEdit) {
          const changedObj = this.topMenuItems.find(el => el._id.toString() === this.upsertTopMenuItem.id.toString());
          changedObj.info.text = this.upsertTopMenuItem.text;
          changedObj.info.href = this.upsertTopMenuItem.href;
          this.changeField();
        } else {
          this.upsertTopMenuItem.isEdit = true;
          this.changeField();
        }

        this.progressService.disable();
      },
      (err) => {
        this.progressService.disable();
      }
    );
  }

  clearFields() {
    this.upsertTopMenuItem = {
      text: '',
      href: '',
      id: null,
      column: null,
      isEdit: false,
    };
  }

  changeField() {
    const text = this.upsertTopMenuItem.text.trim().toLowerCase();
    const href = this.upsertTopMenuItem.href.trim().toLowerCase();

    if (this.upsertTopMenuItem.isEdit && text && href &&
      this.topMenuItems.findIndex(el => el.info.text.toLowerCase() === text && el.info.href.toLowerCase() === href) === -1)
      this.topMenuChanged = true;
    else
      this.topMenuChanged = false;
  }

  topMenuApplyDisability() {
    if (this.upsertTopMenuItem.isEdit) {
      return !this.topMenuChanged || (!this.upsertTopMenuItem.text || !this.upsertTopMenuItem.href);
    } else {
      return !this.upsertTopMenuItem.text || !this.upsertTopMenuItem.href;
    }
  }
}
