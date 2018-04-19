import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.css']
})
export class EditPanelComponent implements OnInit {
  placement = null;
  rowTemplate = null;
  rowTemplateList = [
    {
      name: 'تمام عرض',
      value: 'full',
    },
    {
      name: 'یک دوم',
      value: 'half',
    },
    {
      name: 'یک سوم',
      value: 'third',
    },
    {
      name: 'یک چهارم',
      value: 'quarter',
    }
  ];
  areaPosition = [
    ['left-top', 'center-top', 'right-top'],
    ['left-center', 'center-center', 'right-center'],
    ['left-bottom', 'center-bottom', 'right-bottom'],
  ];
  selectedArea = {
    pos: null,
    title: null,
    text: null,
    buttonText: null,
    titleColor: '#000000',
    textColor: '#000000',
    buttonBackgroundColor: '#ffffff',
    buttonColor: '#000000',
  };
  titleColor = null;
  areaDoneBtnShouldDisabled = true;
  hasTopTitle = false;
  topTitle = {
    title: null,
    text: null,
    titleColor: '#000000',
    textColor: '#000000',
  };
  hasSubTitle = false;
  subTitle = {
    title: null,
    text: null,
    titleColor: '#000000',
    textColor: '#000000',
  };

  constructor(public dialogRef: MatDialogRef<EditPanelComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.placement = this.data.placement;
  }

  showImageAreas() {
    if (!this.rowTemplate)
      return false;

    if (this.rowTemplate === 'full' || this.rowTemplate === 'half')
      return true;

    return false;
  }

  haveCurrentArea(pos) {
    if (this.placement && this.placement.info.areas.find(el => el.pos === pos))
      return true;
    else
      return false;
  }

  setArea(pos) {
    let obj = null;
    if (this.placement)
      obj = this.placement.info.areas.find(el => el.pos.toLowerCase() === pos.toLowerCase());

    if (this.placement && obj)
      Object.keys(this.selectedArea).forEach(el => this.selectedArea[el] = obj[el]);
    else {
      this.selectedArea = {
        pos: pos,
        title: null,
        text: null,
        buttonText: null,
        titleColor: '#000000',
        textColor: '#000000',
        buttonBackgroundColor: '#ffffff',
        buttonColor: '#000000',
      };
      this.areaDoneBtnShouldDisabled = true;
    }
  }

  saveArea() {
    if (!this.placement)
      this.placement = {info: {}};
    if (!this.placement.info.areas)
      this.placement.info.areas = [];
    this.placement.info.areas.push(Object.assign({}, this.selectedArea));
  }

  removeArea() {
    this.placement.info.areas = this.placement.info.areas.filter(el => el.pos.toLowerCase() !== this.selectedArea.pos);
    this.selectedArea = {
      pos: null,
      title: null,
      text: null,
      buttonText: null,
      titleColor: '#000000',
      textColor: '#000000',
      buttonBackgroundColor: '#ffffff',
      buttonColor: '#000000',
    };
  }

  changedArea() {
    let obj = null;
    if (this.placement)
      obj = this.placement.info.areas.find(el => el.pos.toLowerCase() === this.selectedArea.pos.toLowerCase());

    this.areaDoneBtnShouldDisabled = true;
    if (this.placement && obj) {
      // This area is exist
      Object.keys(this.selectedArea).forEach(el => {
        if (obj[el].toLowerCase() !== this.selectedArea[el].toLowerCase()) {
          this.areaDoneBtnShouldDisabled = false;
          return;
        }
      });
    } else {
      // This area isn't exist
      let noError = false;
      ['title', 'text', 'buttonText'].forEach(el => {
        if (this.selectedArea[el] && this.selectedArea[el].trim())
          noError = true;
      });
      ['titleColor', 'textColor', 'buttonBackgroundColor', 'buttonColor'].forEach(el => {
        if (!this.selectedArea[el] || !this.selectedArea[el].trim())
          noError = false;
      });

      this.areaDoneBtnShouldDisabled = !noError;
    }
  }

  changeField() {

  }

  saveChanges() {
    this.dialogRef.close(this.placement);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
