import {Component, Input, OnInit} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-menu-placement',
  templateUrl: './menu-placement.component.html',
  styleUrls: ['./menu-placement.component.css']
})
export class MenuPlacementComponent implements OnInit {
  @Input() pageId = null;

  @Input()
  set placements(value: IPlacement[]) {
    if (value) {
      this.topMenuItems = value.filter(el => el.variable_name.toLowerCase() === 'topmenu');
      this.subMenuItems = value.filter(el => el.variable_name.toLowerCase() === 'submenu');
    }
  }

  topMenuItems: IPlacement[] = [];
  subMenuItems: IPlacement[] = [];
  upsertTopMenuItem = {
    text: '',
    href: '',
    isEdit: false,
  };
  topMenuChanged = false;

  constructor(private httpService: HttpService, private dragulaService: DragulaService) {
  }

  ngOnInit() {
    this.dragulaService.setOptions('top-menu-bag', {
      direction: 'horizontal',
    });

    this.dragulaService.dropModel.subscribe((value) => {
      console.log(value.slice(1));
      this.changeTopMenuOrder(value.slice(1));
    });
  }

  removeItem() {
    const index = this.topMenuItems.findIndex(
      el => el.info.text === this.upsertTopMenuItem.text && el.info.href === this.upsertTopMenuItem.href);
    if (index !== -1) {
      this.topMenuItems.splice(index, 1);

      // ToDo: send to server to remove item
    }
  }

  selectItem(value) {
    this.upsertTopMenuItem = {
      text: value.info.text,
      href: value.info.href,
      isEdit: true,
    };
  }

  changeTopMenuOrder(args) {
    const [element, target, source] = args;

    let counter = 0;
    Object.keys(target.children).forEach(child => {
      const obj = this.topMenuItems.find(el => el.info.text === target.children[child].innerText);
      if (obj) {
        obj.info.order = counter;
        counter++;
      }
    });

    // ToDo: send to server to save new order
  }

  modifyItem(isEdit) {
    // if(isEdit)
    //   this.httpService.post('placement', {
    //     // page_id: page
    //   })

    // ToDo: apply changes in server
  }

  clearFields() {
    this.upsertTopMenuItem = {
      text: '',
      href: '',
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
