import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {HttpService} from './http.service';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class RevertPlacementService {
  private onRevertMode = false;
  private selectedList: any = {};
  itemsCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private snackBar: MatSnackBar, private httpService: HttpService) {}

  getRevertMode() {
    return this.onRevertMode;
  }

  setRevertMode(value) {
    this.onRevertMode = value;
  }

  selectBatch(list) {
    list.forEach(el => {
      this.select(el.component_name + (el.variable_name ? '-' + el.variable_name : ''), el, true, false);
    });

    const currentItemsCount = list.filter(el => !el.end_date).length;

    if (currentItemsCount) {
      this.snackBar.open((currentItemsCount === list.length ? 'همه' : 'برخی از ') + ' موارد در حال حاضر وجود دارند', null, {
        duration: 2300,
      });
    }

    this.itemsCount.next(Object.keys(this.selectedList).map(el => this.selectedList[el]).reduce((a, b) => a.concat(b), []).length);
  }

  unSelectBatch() {
    Object.keys(this.selectedList).forEach(el => {
      this.selectedList[el] = [];
    });

    this.itemsCount.next(0);
  }

  select(component_name, item, isBatch = false, shouldSelect = false) {
    if (!this.selectedList[component_name])
      this.selectedList[component_name] = [];

    if (!isBatch && !item.end_date) {
      this.snackBar.open('این مورد در حال حاضر وجود دارد', null, {
        duration: 2300,
      });
      return;
    } else if (isBatch && !item.end_date)
      return;

    if (!shouldSelect && this.selectedList[component_name].includes(item._id))
      this.selectedList[component_name] = this.selectedList[component_name].filter(el => el !== item._id);
    else
      this.selectedList[component_name].push(item._id);

    if (!isBatch)
      this.itemsCount.next(Object.keys(this.selectedList).map(el => this.selectedList[el]).reduce((a, b) => a.concat(b), []).length);
  }

  isSelected(componet_name, id) {
    const list = this.selectedList[componet_name];
    return list ? list.includes(id) : false;
  }

  revert(pageId) {
    return new Promise((resolve, reject) => {
      this.httpService.post('placement/revert', {
        placements: Object.keys(this.selectedList).map(el => this.selectedList[el]).reduce((a, b) => a.concat(b), []),
        page_id: pageId,
      }).subscribe(
        (res) => {
          Object.keys(this.selectedList).forEach(el => this.selectedList[el] = []);
          this.itemsCount.next(0);
          resolve();
        },
        (err) => {
          reject();
        });
    });
  }
}
