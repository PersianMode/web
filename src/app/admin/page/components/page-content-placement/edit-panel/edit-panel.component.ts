import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {PlacementModifyEnum} from '../../../enum/placement.modify.type.enum';
import {DragulaService} from 'ng2-dragula';
import {HttpService} from '../../../../../shared/services/http.service';
import {ProgressService} from '../../../../../shared/services/progress.service';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.css']
})
export class EditPanelComponent implements OnInit {
  insertedAddress = '';
  setClear: boolean = false;
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
  areaPosition: any = {
    'top': ['left-top', 'center-top', 'right-top'],
    'center': ['left-center', 'center-center', 'right-center'],
    'bottom': ['left-bottom', 'center-bottom', 'right-bottom'],
  };
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
  areas = [];
  saveButtonShouldBeDisabled = true;
  urlAddress = '';
  imageUrl = '';
  fileType = {};
  pageId = null;
  isAdd = true;
  selectedAreaToSwitch: any = null;

  constructor(public dialogRef: MatDialogRef<EditPanelComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar, private dragulaService: DragulaService, private httpService: HttpService,
    private progressService: ProgressService) {
  }

  ngOnInit() {
    this.placement = this.data.placement;
    this.pageId = this.data.pageId;
    this.isAdd = this.placement ? false : true;
    if (!this.isAdd) {
      this.rowTemplate = this.placement.info.panel_type;
      this.urlAddress = this.placement.info.href;
      this.imageUrl = this.placement.info.imageUrl;
      this.areas = this.placement.info.areas.slice();
      if (this.placement.info.topTitle) {
        this.hasTopTitle = true;
        this.topTitle = this.placement.info.topTitle;
      }
      if (this.placement.info.subTitle) {
        this.hasSubTitle = true;
        this.subTitle = this.placement.info.subTitle;
      }
    }
  }

  changeAreaPosition(source, target) {
    const sourceArea = this.areas.find(item => item.pos.toLowerCase() === source.toLowerCase());
    const targetArea = this.areas.find(item => item.pos.toLowerCase() === target.toLowerCase());

    this.selectedAreaToSwitch = null;

    if (targetArea)
      targetArea.pos = source;
    if (sourceArea)
      sourceArea.pos = target;

    console.log(this.placement);

    this.progressService.enable();
    this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: this.placement._id,
          info: this.placement.info,
        }
      ]
    }).subscribe(
      (data) => {
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot upsert an item: ', err);
        this.progressService.disable();
      }
    );

    this.setArea(target);
  }

  showImageAreas() {
    if (!this.rowTemplate)
      return false;

    if (this.rowTemplate === 'full' || this.rowTemplate === 'half')
      return true;

    return false;
  }

  haveCurrentArea(pos) {
    if (!this.isAdd && this.areas.find(el => el.pos.toLowerCase() === pos.toLowerCase()))
      return true;
    else
      return false;
  }

  setArea(pos) {
    if (this.selectedAreaToSwitch) {
      this.changeAreaPosition(this.selectedAreaToSwitch, pos);
      return;
    }

    let obj = null;
    if (!this.isAdd)
      obj = this.areas.find(el => el.pos.toLowerCase() === pos.toLowerCase());

    if (!this.isAdd && obj)
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
    const areaIndex = this.areas.findIndex(el => el.pos.toLowerCase() === this.selectedArea.pos.toLowerCase());
    if (areaIndex !== -1) {
      this.areas[areaIndex] = Object.assign({}, this.selectedArea);
    } else {
      this.areas.push(Object.assign({}, this.selectedArea));
    }

    this.changeField();
    this.areaDoneBtnShouldDisabled = true;
  }

  removeArea() {
    this.setClear = true;
    this.areas = this.areas.filter(el => el.pos.toLowerCase() !== this.selectedArea.pos);
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
    if (!this.isAdd)
      obj = this.areas.find(el => el.pos.toLowerCase() === this.selectedArea.pos.toLowerCase());

    this.areaDoneBtnShouldDisabled = true;
    if (!this.isAdd && obj) {
      // This area exists
      Object.keys(this.selectedArea).forEach(el => {
        if (obj[el].toLowerCase() !== this.selectedArea[el].toLowerCase()) {
          this.areaDoneBtnShouldDisabled = false;
          return;
        }
      });
    } else {
      // This area doesn't exist
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
    this.setClear = false;
    this.saveButtonShouldBeDisabled = false;
    let anyChanges = false;

    if (!this.urlAddress)
      this.saveButtonShouldBeDisabled = true;
    else if (this.isAdd || this.urlAddress.toLowerCase() !== this.placement.info.href.toLowerCase())
      anyChanges = true;
    if (!this.rowTemplate)
      this.saveButtonShouldBeDisabled = true;
    else if (this.isAdd || this.rowTemplate.toLowerCase() !== this.placement.info.panel_type.toLowerCase())
      anyChanges = true;
    // ToDo: Check image
    if (this.hasTopTitle) {
      if (!this.topTitle.title && !this.topTitle.text)
        this.saveButtonShouldBeDisabled = true;
      else if (!this.topTitle.titleColor || !this.topTitle.textColor)
        this.saveButtonShouldBeDisabled = true;
      else {
        if (this.isAdd || !this.placement.info.topTitle)
          anyChanges = true;
        else {
          if ((this.placement.info.topTitle.title !== this.topTitle.title) ||
            (this.placement.info.topTitle.text !== this.topTitle.text) ||
            (this.placement.info.topTitle.titlecolor !== this.topTitle.titleColor) ||
            (this.placement.info.topTitle.textColor !== this.topTitle.textColor))
            anyChanges = true;
        }
      }
    }
    if (this.hasSubTitle) {
      if (!this.subTitle.title && !this.subTitle.text)
        this.saveButtonShouldBeDisabled = true;
      else if (!this.subTitle.titleColor || !this.subTitle.textColor)
        this.saveButtonShouldBeDisabled = true;
      else {
        if (this.isAdd || !this.placement.info.subTitle)
          anyChanges = true;
        else {
          if ((this.placement.info.subTitle.title !== this.subTitle.title) ||
            (this.placement.info.subTitle.text !== this.subTitle.text) ||
            (this.placement.info.subTitle.titlecolor !== this.subTitle.titleColor) ||
            (this.placement.info.subTitle.textColor !== this.subTitle.textColor))
            anyChanges = true;
        }
      }
    }

    if (this.saveButtonShouldBeDisabled || anyChanges)
      return;

    // Check changes
    if ((this.isAdd && this.areas.length) || (this.areas.length !== this.placement.info.areas.length))
      anyChanges = true;
    else {
      if (!this.isAdd)
        this.areas.forEach(el => {
          const arObj = this.placement.info.areas.find(i => i.pos.toLowerCase() === el.pos.toLowerCase());
          if (Object.keys(el).length !== Object.keys(arObj).length)
            anyChanges = true;
          else
            Object.keys(el).forEach(i => {
              if (el[i].toLowerCase() !== arObj[i].toLowerCase())
                anyChanges = true;
            });
        });
    }

    if (!anyChanges)
      this.saveButtonShouldBeDisabled = true;
  }

  saveChanges() {
    const resultObj = {
      type: !this.isAdd ? PlacementModifyEnum.Modify : PlacementModifyEnum.Add,
      placement: {
        _id: this.placement ? this.placement._id : null,
        component_name: 'main',
        info: {
          panel_type: this.rowTemplate,
          imgUrl: this.placement && this.placement._id ? this.imageUrl : null,
          href: this.urlAddress,
          areas: this.areas,
          topTitle: this.hasTopTitle ? this.topTitle : null,
          subTitle: this.hasSubTitle ? this.subTitle : null,
        }
      }
    };

    if (this.isAdd)
      resultObj.placement.info['fileType'] = this.placement && this.placement._id ? this.fileType : null;

    this.dialogRef.close(resultObj);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  imageUploadUrl() {
    if (!this.isAdd)
      return `placement/image/${this.pageId}/${this.placement._id}`;

    return `placement/image/${this.pageId}/null`;
  }

  imageUploaded(data) {
    if (data.length > 0) {
      this.snackBar.open('با موفقیت بارگذاری شد', null, {
        duration: 2300,
      });
      this.saveButtonShouldBeDisabled = false;
      if (this.isAdd) {
        this.imageUrl = data[0].downloadURL;
        this.placement = {_id: data[0].placementId};
        this.fileType = data[0].fileType;
      } else
        this.imageUrl = data[0];
    } else
      this.snackBar.open('بارگذاری با خطا روبه‌رو شد. دوباره تلاش کنید', null, {
        duration: 3200,
      });
  }

  getThisPlacement() {
    return {
      component_name: 'main',
    };
  }

  getRowPositions() {
    return Object.keys(this.areaPosition);
  }

  changePosition(pos) {
    this.selectedAreaToSwitch = this.selectedAreaToSwitch ? null : pos;
    if (this.selectedAreaToSwitch)
      this.snackBar.open('روی خانه ی مقصد جهت جا به جایی کلیک کنید', null, {
        duration: 2000,
      });
  }
}
