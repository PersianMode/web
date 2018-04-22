import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {DragulaService} from 'ng2-dragula';
import {PlacementModifyEnum} from '../../enum/placement.modify.type.enum';
import {MatDialog} from '@angular/material';
import {EditPanelComponent} from './edit-panel/edit-panel.component';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-page-content-placement',
  templateUrl: './page-content-placement.component.html',
  styleUrls: ['./page-content-placement.component.css']
})
export class PageContentPlacementComponent implements OnInit {
  @Input()
  set placements(value) {
    this._placements = value;
    if (value)
      this.arrangePlacements(value);
  }
  get placements() {
    return this._placements;
  }

  @Input() pageId = null;
  @Output() modifyPlacement = new EventEmitter();

  _placements = [];
  modifiedPlacementList = {};

  constructor(private httpService: HttpService, private progressService: ProgressService,
    private dragulaService: DragulaService, private dialog: MatDialog,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  modifyItem(value) {
    switch (value.type) {
      case PlacementModifyEnum.Add:
        this.upsertItem(value.data, true);
        break;
      case PlacementModifyEnum.Modify:
        this.upsertItem(value.data, false);
        break;
      case PlacementModifyEnum.Delete:
        this.removeItem(value.data);
        break;
    }
    // this.modifyPlacement.emit(value);
  }

  removeItem(value) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });

    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          const index = this.placements.findIndex(el => el._id === value._id);
          if (index !== -1)
            this.httpService.post('placement/delete', {
              page_id: this.pageId,
              placement_id: value._id,
            }).subscribe(
              (data) => {
                this.modifyPlacement.emit({
                  type: PlacementModifyEnum.Delete,
                  placement_id: value._id,
                });

                this.progressService.disable();
              },
              (err) => {
                console.error('Cannot remove placement id: ', err);
                this.progressService.disable();
              }
            );
        }
      }
    );
  }

  upsertItem(value, isAdd = false) {
    this.progressService.enable();
    (isAdd ? this.httpService.put('placement', {
      page_id: this.pageId,
      placement: {
        component_name: 'main',
        info: value.info,
      }
    }) : this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: value._id,
          info: value.info,
        }
      ]
    })).subscribe(
      (data) => {
        this.modifyPlacement.emit({
          type: isAdd ? PlacementModifyEnum.Add : PlacementModifyEnum.Modify,
          placement_id: data.placement_id,
          placements: [value],
          placement: data.new_placement,
        });

        this.changedField();

        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot upsert an item: ', err);
        this.progressService.disable();
      }
    );
  }

  setNewValue(destination_obj, source_obj) {
    Object.keys(destination_obj).forEach(el => {
      if (source_obj[el])
        destination_obj[el] = source_obj[el];
    });
  }

  changedField() {

  }

  openEditDialog(plc = null) {
    const editDialog = this.dialog.open(EditPanelComponent, {
      width: '900px',
      data: {
        placement: plc,
        pageId: this.pageId,
      },
      disableClose: true,
    });

    editDialog.afterClosed().subscribe(
      (data) => {
        if (data) {
          switch (data.type) {
            case PlacementModifyEnum.Add: {
              // Set column and row if needed
              this.setColumnRow(data.placement);
              this.upsertItem(data.placement, true);
            }
              break;
            case PlacementModifyEnum.Modify: {
              const changedObj = this.placements.find(el => el._id === data.placement._id);
              // Set column and row if needed
              this.setNewValue(changedObj.info, data.placement.info);
              this.setColumnRow(changedObj);
              this.upsertItem(changedObj, false);
            }
              break;
          }
        }
      }
    );
  }

  setColumnRow(obj) {
    if (obj.info.row) {
      // Maybe need to change position of item
      const currentRowIndex = obj.info.row;
      const currentRowList = this.modifiedPlacementList[currentRowIndex];

      let emptySpace = 100;
      currentRowList.filter(el => el._id !== obj._id).forEach(el => {
        emptySpace -= this.getRowParts(el);
      });

      if (emptySpace < this.getRowParts(obj)) {
        // Should change item's position
        const lastRowIndex = Math.max(...Object.keys(this.modifiedPlacementList).map(el => parseInt(el, 10)));
        const lastRowList = this.modifiedPlacementList[lastRowIndex];

        obj.info.row = lastRowIndex + 1;
        obj.info.column = 0;
      }

    } else {
      // The obj is added newly
      const lastRowIndex = Math.max(...Object.keys(this.modifiedPlacementList).map(el => parseInt(el, 10)));
      const lastRowList = this.modifiedPlacementList[lastRowIndex];

      let emptySpace = 100;
      lastRowList.forEach(el => {
        emptySpace -= this.getRowParts(el);
      });

      if (emptySpace >= this.getRowParts(obj)) {
        obj.info.row = lastRowIndex;
        obj.info.column = lastRowList.length + 1;
      } else {
        obj.info.row = lastRowIndex + 1;
        obj.info.column = 0;
      }
    }
  }

  getRowParts(item) {
    switch (item.info.panel_type.toLowerCase()) {
      case 'full': return 100;
      case 'half': return 50;
      case 'third': return 33;
      case 'quarter': return 25;
    }
  }

  arrangePlacements(placementList) {
    this.modifiedPlacementList = {};
    placementList.forEach(el => {
      if (!this.modifiedPlacementList[el.info.row])
        this.modifiedPlacementList[el.info.row] = [];

      this.modifiedPlacementList[el.info.row].push(el);
    });
  }

  getKeyList(data) {
    return Object.keys(data);
  }

  getUrl(url) {
    if (url)
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + (url[0] === '/' ? url : '/' + url));
  }
}
