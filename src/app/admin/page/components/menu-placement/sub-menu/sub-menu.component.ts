import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../../shared/services/progress.service';
import {PlacementModifyEnum} from '../../../enum/placement.modify.type.enum';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RemovingConfirmComponent} from '../../../../../shared/components/removing-confirm/removing-confirm.component';


enum ItemArea {
  Header,
  Middle,
  Left,
}

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {
  @Input() pageId = null;
  insertedAddress: string;
  @Input()
  set placements(value: IPlacement[]) {
    if (value) {
      this.subMenuItems = value;
      this.getRelatedItems();
    }
  }

  @Input()
  set section(value) {
    if (value !== this.selectedSection) {
      this.selectedItem = null;
      if (this.subMenuForm)
        this.subMenuForm.reset();
    }

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
  bagName = 'sub-menu-bag';
  areaList = [
    {
      name: 'بخش راست',
      value: this.itemArea.Header,
    },
    {
      name: 'بخش وسط',
      value: this.itemArea.Middle,
    },
    {
      name: 'بخش چپ',
      value: this.itemArea.Left,
    },
  ];
  subMenuForm: FormGroup;
  selectedItem = null;
  anyChanges = false;
  headerAreaNewEmptyList = [];
  headerAreaHasNewColumn = false;
  middleAreaNewEmptyList = [];
  middleAreaHasNewColumn = false;
  leftAreaNewEmptyList = [];
  leftAreaHasNewColumn = false;

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
    private progressService: ProgressService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (!this.dragulaService.find(this.bagName))
      this.dragulaService.setOptions(this.bagName, {
        direction: 'vertical',
      });

    this.dragulaService.dropModel.subscribe((value) => {
      if (this.bagName === value[0])
        this.changeMenuItemOrder();
    });

    this.initForm();

    this.subMenuForm.valueChanges.subscribe(
      () => this.fieldChanged()
    );
  }

  initForm() {
    this.subMenuForm = new FormBuilder().group({
      text: [null, [
        Validators.required,
      ]],
      area: [null, [
        Validators.required,
      ]],
      is_header: [false, [
        // Validators.required,
      ]]
    });
  }

  setFormValue(value = null) {
    if (!value) {
      this.subMenuForm.reset();
      this.subMenuForm.controls['area'].enable();
    } else {
      this.subMenuForm.controls['text'].setValue(value.text);
      switch (value.section.toLowerCase().split('/')[1]) {
        case 'header':
          this.subMenuForm.controls['area'].setValue(this.itemArea.Header);
          break;
        case 'middle':
          this.subMenuForm.controls['area'].setValue(this.itemArea.Middle);
          break;
        case 'left':
          this.subMenuForm.controls['area'].setValue(this.itemArea.Left);
          break;
      }
      this.subMenuForm.controls['area'].disable();
      this.subMenuForm.controls['is_header'].setValue(value.is_header ? value.is_header : false);
    }
  }

  getRelatedItems() {
    if (!this.selectedSection)
      return;

    this.headerAreaItems = {};
    this.middleAreaItems = {};
    this.leftAreaItems = {};

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
    if (this.headerAreaColumns.length === 0) {
      this.headerAreaColumns = [0];
      this.headerAreaItems = {0: []};
    }
    this.middleAreaColumns = Object.keys(this.middleAreaItems);
    if (this.middleAreaColumns.length === 0) {
      this.middleAreaColumns = [0];
      this.middleAreaItems = {0: []};
    }
    this.leftAreaColumns = Object.keys(this.leftAreaItems);
    if (this.leftAreaColumns.length === 0) {
      this.leftAreaColumns = [0];
      this.leftAreaItems = {0: []};
    }
  }

  private sortColumnItems(list) {
    list.sort((a, b) => {
      if (a.info.row > b.info.row)
        return 1;
      else if (a.info.row < b.info.row)
        return -1;

      return 0;
    });
  }

  changeMenuItemOrder() {
    let placementList = [];

    Object.keys(this.headerAreaItems).forEach(column => {
      let rowCounter = 1;
      let orderIsChanged = false;
      this.headerAreaItems[column].forEach(placement => {
        if (placement.info.column !== +column || placement.info.row !== rowCounter || placement.info.section.split('/')[1] !== 'header')
          orderIsChanged = true;

        placement.info.column = +column;
        placement.info.row = (rowCounter++);
        placement.info.section = this.selectedSection + '/header';
      });
      if (orderIsChanged)
        placementList = placementList.concat(this.headerAreaItems[column]);
    });

    // Check headerAreaNewEmptyList
    let virtualColumn = Math.max(...Object.keys(this.headerAreaItems).map(el => parseInt(el, 10))) + 1;
    let virtualRowCounter = 1;
    this.headerAreaNewEmptyList.forEach(placement => {
      placement.info.column = virtualColumn;
      placement.info.row = (virtualRowCounter++);
    });
    placementList = placementList.concat(this.headerAreaNewEmptyList);
    this.headerAreaNewEmptyList = [];
    this.headerAreaHasNewColumn = false;

    Object.keys(this.middleAreaItems).forEach(column => {
      let rowCounter = 1;
      let orderIsChanged = false;
      this.middleAreaItems[column].forEach(placement => {
        if (placement.info.column !== +column || placement.info.row !== rowCounter || placement.info.section.split('/')[1] !== 'middle')
          orderIsChanged = true;

        placement.info.column = +column;
        placement.info.row = (rowCounter++);
        placement.info.section = this.selectedSection + '/middle';
      });
      if (orderIsChanged)
        placementList = placementList.concat(this.middleAreaItems[column]);
    });

    // Check middleAreaNewEmptyList
    virtualColumn = Math.max(...Object.keys(this.middleAreaItems).map(el => parseInt(el, 10))) + 1;
    virtualRowCounter = 1;
    this.middleAreaNewEmptyList.forEach(placement => {
      placement.info.column = virtualColumn;
      placement.info.row = (virtualRowCounter++);
    });
    placementList = placementList.concat(this.middleAreaNewEmptyList);
    this.middleAreaNewEmptyList = [];
    this.middleAreaHasNewColumn = false;

    Object.keys(this.leftAreaItems).forEach(column => {
      let rowCounter = 1;
      let orderIsChanged = false;
      this.leftAreaItems[column].forEach(placement => {
        if (placement.info.column !== +column || placement.info.row !== rowCounter || placement.info.section.split('/')[1] !== 'left')
          orderIsChanged = true;

        placement.info.column = +column;
        placement.info.row = (rowCounter++);
        placement.info.section = this.selectedSection + '/left';
      });
      if (orderIsChanged)
        placementList = placementList.concat(this.leftAreaItems[column]);
    });

    // Check leftAreaNewEmptyList
    virtualColumn = Math.max(...Object.keys(this.leftAreaItems).map(el => parseInt(el, 10))) + 1;
    virtualRowCounter = 1;
    this.leftAreaNewEmptyList.forEach(placement => {
      placement.info.column = virtualColumn;
      placement.info.row = (virtualRowCounter++);
    });
    placementList = placementList.concat(this.leftAreaNewEmptyList);
    this.leftAreaNewEmptyList = [];
    this.leftAreaHasNewColumn = false;

    if (placementList.length > 0) {
      this.progressService.enable();
      this.httpService.post('placement', {
        page_id: this.pageId,
        placements: placementList,
      }).subscribe(
        (data) => {
          this.modifyPlacement.emit({
            type: PlacementModifyEnum.Modify,
            placements: placementList,
          });
          this.progressService.disable();
        },
        (err) => {
          console.error('Cannot update the placement orders: ', err);
          this.progressService.disable();
        }
      );
    }
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
  selectItem(value) {
    this.selectedItem = value;
    this.selectedItem.info.is_header = this.selectedItem.info.is_header || false;
    this.setFormValue(value.info);
    this.anyChanges = false;
  }

  modifyItem() {
    if (!this.insertedAddress) {
      this.openSnackBar('وارد کردن آدرس برای صفحه الزامی است');
      return; }
    this.progressService.enable();
    (this.selectedItem ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: this.selectedItem._id,
          info: this.getItemInfo(),
        }
      ]
    }) : this.httpService.put('placement', {
      page_id: this.pageId,
      placement: {
        component_name: 'menu',
        variable_name: 'subMenu',
        info: this.getItemInfo(true),
      }
    })
    ).subscribe(
      (data: any) => {
        this.modifyPlacement.emit({
          type: this.selectedItem ? PlacementModifyEnum.Modify : PlacementModifyEnum.Add,
          placement_id: data.placement_id,
          placements: [this.selectedItem],
          placement: data.new_placement,
        });

        if (this.selectedItem) {
          const newInfo = this.getItemInfo();
          const changedObj = this.subMenuItems.find(el => el._id === this.selectedItem._id);
          changedObj.info.text = newInfo.text;
          changedObj.info.insertedAddress = newInfo.insertedAddress;
          changedObj.info.is_header = newInfo.is_header;
        } else {
          const newInfo = this.getItemInfo(true);
          this.selectedItem = data.new_placement;
        }

        this.anyChanges = false;
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot modify item in server: ', err);
        this.progressService.disable();
      }
    );
  }

  getItemInfo(isNewItem = false): any {
    const res = {
      text: (this.subMenuForm.controls['text'].value ? this.subMenuForm.controls['text'].value : '').trim(),
      href: (this.insertedAddress ? this.insertedAddress : '').trim(),
      is_header: this.subMenuForm.controls['is_header'].value,
    };

    let tempSectionName = 'header';
    let tempColumns = this.headerAreaColumns;
    let tempItems = this.headerAreaItems;
    switch (this.subMenuForm.controls['area'].value) {
      case this.itemArea.Header: {
        tempSectionName = 'header';
        tempColumns = this.headerAreaColumns;
        tempItems = this.headerAreaItems;
      }
        break;
      case this.itemArea.Middle: {
        tempSectionName = 'middle';
        tempColumns = this.middleAreaColumns;
        tempItems = this.middleAreaItems;
      }
        break;
      case this.itemArea.Left: {
        tempSectionName = 'left';
        tempColumns = this.leftAreaColumns;
        tempItems = this.leftAreaItems;
      }
        break;
    }

    if (!this.selectedItem || this.selectedItem.info.section.split('/')[1] !== tempSectionName) {
      if (isNewItem) {
        res['column'] = tempColumns.length && tempItems[Object.keys(tempItems)[0]].length ? Math.max(...tempColumns
          .map(el => tempItems[el])
          .reduce((a, b) => (a || []).concat(b || []))
          .map(el => el.info.column)) : 1;
        res['row'] = (tempColumns.length && tempItems[Object.keys(tempItems)[0]].length ? Math.max(...tempColumns
          .map(el => tempItems[el])
          .reduce((a, b) => (a || []).concat(b || []))
          .map(el => el.info.row)) : 0) + 1;
      }
      res['section'] = this.selectedSection + '/' + tempSectionName;
    }

    return res;
  }

  removeItem() {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });

    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          const index = this.subMenuItems.findIndex(
            el => el.info.text === this.selectedItem.info.text && el.info.href === this.selectedItem.info.href);
          if (index !== -1)
            this.httpService.post('placement/delete', {
              page_id: this.pageId,
              placement_id: this.subMenuItems[index]._id,
            }).subscribe(
              (data) => {
                this.modifyPlacement.emit({
                  type: PlacementModifyEnum.Delete,
                  placement_id: this.subMenuItems[index]._id,
                });
                this.selectedItem = null;
                this.setFormValue();
                this.anyChanges = false;
                this.progressService.disable();
              },
              (err) => {
                console.error('Cannot delete placement item: ', err);
                this.progressService.disable();
              });
        }
      }
    );
  }

  clearFields() {
    this.subMenuForm.reset();
    this.selectedItem = null;
    this.subMenuForm.controls['area'].enable();
  }

  fieldChanged() {
    if (!this.selectedItem) {
      this.anyChanges = true;
      return;
    }

    this.anyChanges = false;

    const tempInfo = this.getItemInfo();

    ['text', 'href', 'is_header'].forEach(el => {
      if (tempInfo[el] !== this.selectedItem.info[el]) {
        this.anyChanges = true;
        return;
      }
    });
  }

  addColumn(area) {
    switch (area) {
      case 'header': {
        this.headerAreaNewEmptyList = [];
        this.headerAreaHasNewColumn = true;
      }
        break;
      case 'middle': {
        this.middleAreaNewEmptyList = [];
        this.middleAreaHasNewColumn = true;
      }
        break;
      case 'left': {
        this.leftAreaNewEmptyList = [];
        this.leftAreaHasNewColumn = true;
      }
        break;
    }
  }

  addColumnDisability(area) {
    switch (area) {
      case 'header': {
        if (!Object.keys(this.headerAreaItems).length)
          return true;
        const lastColumn = Math.max(...Object.keys(this.headerAreaItems).map(el => parseInt(el, 10)));
        return this.headerAreaHasNewColumn || !this.headerAreaItems[lastColumn].length;
      }
      case 'middle': {
        if (!Object.keys(this.middleAreaItems).length)
          return true;
        const lastColumn = Math.max(...Object.keys(this.middleAreaItems).map(el => parseInt(el, 10)));
        return this.middleAreaHasNewColumn || !this.middleAreaItems[lastColumn].length;
      }
      case 'left': {
        if (!Object.keys(this.leftAreaItems).length)
          return true;
        const lastColumn = Math.max(...Object.keys(this.leftAreaItems).map(el => parseInt(el, 10)));
        return this.leftAreaHasNewColumn || !this.leftAreaItems[lastColumn].length;
      }
    }
  }
}
