import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {DragulaService} from 'ng2-dragula';
import {PlacementModifyEnum} from '../../enum/placement.modify.type.enum';
import {MatDialog} from '@angular/material';
import {EditPanelComponent} from './edit-panel/edit-panel.component';

@Component({
  selector: 'app-page-content-placement',
  templateUrl: './page-content-placement.component.html',
  styleUrls: ['./page-content-placement.component.css']
})
export class PageContentPlacementComponent implements OnInit {
  @Input() placements = [];
  @Input() pageId = null;
  @Output() modifyPlacement = new EventEmitter();

  constructor(private httpService: HttpService, private progressService: ProgressService,
              private dragulaService: DragulaService, private dialog: MatDialog) {
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

        if (!isAdd) {
          const changedObj = this.placements.find(el => el._id === value._id);
          this.setNewValue(changedObj, value);
        }
        this.changedField();

        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot upsert an item: ', err);
        this.progressService.disable();
      }
    );
  }

  setNewValue(dest_obj, source_obj) {

  }

  changedField() {

  }

  addItem() {
    const editDialog = this.dialog.open(EditPanelComponent, {
      width: '900px',
      data: {
        placement: null,
      },
      disableClose: true,
    });

    editDialog.afterClosed().subscribe(
      (data) => {
        console.log(data);
      }
    );
  }
}
