import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {PlacementModifyEnum} from '../../enum/placement.modify.type.enum';
import {MatDialog} from '@angular/material';
import {EditPanelComponent} from './edit-panel/edit-panel.component';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {DomSanitizer} from '@angular/platform-browser';
import {PageService} from '../../../../shared/services/page.service';

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
  @ViewChild('player') player;

  _placements = [];
  modifiedPlacementList = {};
  moveButtonsShouldDisabled = false;

  constructor(private httpService: HttpService, private progressService: ProgressService,
              private dialog: MatDialog, private sanitizer: DomSanitizer,
              private pageService: PageService) {
  }

  ngOnInit() {
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
        _id: value._id,
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
        if (this.player)
          this.player.nativeElement.load();
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
      else if (destination_obj[el] && !source_obj[el] && el === 'fileType')
        delete destination_obj[el];
    });
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
      if (currentRowList && currentRowList.length)
        currentRowList.filter(el => el._id !== obj._id).forEach(el => {
          emptySpace -= this.getRowParts(el);
        });

      if (emptySpace < this.getRowParts(obj)) {
        // Should change item's position
        const lastRowIndex = Math.max(...Object.keys(this.modifiedPlacementList).map(el => parseInt(el, 10)));
        // const lastRowList = this.modifiedPlacementList[lastRowIndex];

        obj.info.row = lastRowIndex + 1;
        obj.info.column = 1;
      }

    } else {
      // The obj is added newly
      const lastRowIndex = Math.max(...(
        Object.keys(this.modifiedPlacementList).length ?
          Object.keys(this.modifiedPlacementList) :
          ['0']).map(el => parseInt(el, 10)));
      const lastRowList = this.modifiedPlacementList[lastRowIndex];


      let emptySpace = 100;
      if (lastRowList && lastRowList.length)
        lastRowList.forEach(el => {
          emptySpace -= this.getRowParts(el);
        });

      if (emptySpace >= this.getRowParts(obj)) {
        obj.info.row = lastRowIndex;
        obj.info.column = (lastRowList ? Math.max(...lastRowList.map(el => el.info.column)) : 0) + 1;
      } else {
        obj.info.row = lastRowIndex + 1;
        obj.info.column = 1;
      }
    }
  }

  getRowParts(item) {
    switch (item.info.panel_type.toLowerCase()) {
      case 'full':
        return 100;
      case 'half':
        return 50;
      case 'third':
        return 33;
      case 'quarter':
        return 25;
    }
  }

  arrangePlacements(placementList) {
    this.modifiedPlacementList = {};
    placementList.sort((a, b) => {
      if (a.info.row > b.info.row)
        return 1;
      else if (a.info.row < b.info.row)
        return -1;
      else {
        if (a.info.column > b.info.column)
          return 1;
        else if (a.info.column < b.info.column)
          return -1;
        return 0;
      }
    }).forEach(el => {
      if (!this.modifiedPlacementList[el.info.row])
        this.modifiedPlacementList[el.info.row] = [];

      const tempEl = Object.assign(el);
      tempEl.info['mediaType'] = this.getFileTypeFromExtension(el.info.fileType && el.info.fileType['ext'], el.info.imgUrl);
      this.modifiedPlacementList[el.info.row].push(tempEl);
    });
  }

  getKeyList(data) {
    return Object.keys(data);
  }

  getUrl(url) {
    if (url)
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + (url[0] === '/' ? url : '/' + url));
  }

  move(direction, item) {
    switch (direction) {
      case 'up': {
        if (Math.min(...Object.keys(this.modifiedPlacementList).map(el => parseInt(el, 10))) >= +item)
          return;

        this.changeRowOrder(item, false);
      }
        break;
      case 'down': {
        if (Math.max(...Object.keys(this.modifiedPlacementList).map(el => parseInt(el, 10))) <= +item)
          return;

        this.changeRowOrder(item, true);
      }
        break;
      case 'left': {
        if (Math.max(...this.modifiedPlacementList[item.info.row].map(el => el.info.column)) <= +item.info.column)
          return;

        this.changeColumnOrder(item.info.row, item.info.column, true);
      }
        break;
      case 'right': {
        if (Math.min(...this.modifiedPlacementList[item.info.row].map(el => el.info.column)) >= +item.info.column)
          return;

        this.changeColumnOrder(item.info.row, item.info.column, false);
      }
        break;
    }
  }

  changeColumnOrder(rowKey, columnKey, swapWithLeft = false) {
    if ((!rowKey && rowKey !== 0) || (!columnKey && columnKey !== 0))
      return;

    const prePostColumn = this.modifiedPlacementList[rowKey].find(el => +el.info.column === +columnKey + (swapWithLeft ? 1 : -1));
    const curColumn = this.modifiedPlacementList[rowKey].find(el => el.info.column === columnKey);

    if (!prePostColumn || !curColumn)
      return;

    const tempColId = prePostColumn.info.column;
    prePostColumn.info.column = curColumn.info.column;
    curColumn.info.column = tempColId;

    this.changeOrder([prePostColumn, curColumn]);
  }

  changeRowOrder(rowKey, swapWithBottom = false) {
    if (!rowKey && rowKey !== 0)
      return;

    const prePostRow = this.modifiedPlacementList[+rowKey + (swapWithBottom ? 1 : -1)];
    const curRow = this.modifiedPlacementList[rowKey];

    if (!curRow || !prePostRow)
      return;

    const prePostRowId = prePostRow[0].info.row;
    const curRowId = curRow[0].info.row;

    prePostRow.forEach(el => {
      el.info.row = curRowId;
    });

    curRow.forEach(el => {
      el.info.row = prePostRowId;
    });

    this.changeOrder(prePostRow.concat(curRow));
  }

  changeOrder(updatedPlacements) {
    this.progressService.enable();
    this.moveButtonsShouldDisabled = true;
    this.httpService.post('placement', {
      page_id: this.pageId,
      placements: updatedPlacements
    }).subscribe(
      (data) => {
        this.modifyPlacement.emit({
          type: PlacementModifyEnum.Modify,
          placements: data.placement,
        });

        this.progressService.disable();
        this.moveButtonsShouldDisabled = false;
      },
      (err) => {
        console.error('Cannot upsert placement orders: ', err);
        this.progressService.disable();
        this.moveButtonsShouldDisabled = false;
      }
    );
  }

  getFileTypeFromExtension(ext, url) {
    let imgs = this.pageService.fileTypes['images'].filter(el => el === ext);
    if (imgs.length > 0)
      return 'image';

    let vds = this.pageService.fileTypes['videos'].filter(el => el === ext);
    if (vds.length > 0)
      return 'video';

    // if nothing found, we can only check with the extension!
    if (!url)
      return;

    let extension = url.split('.');
    extension = extension[extension.length - 1];
    // console.log('local extension:', extension);
    imgs = this.pageService.fileTypes['images'].filter(el => el === extension);
    if (imgs.length > 0)
      return 'image';

    vds = this.pageService.fileTypes['videos'].filter(el => el === extension);
    if (vds.length > 0)
      return 'video';

    // default fallback
    return 'image';
  }
}
