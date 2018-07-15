import {Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {IPlacement} from '../../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../../shared/services/progress.service';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {PlacementModifyEnum} from '../../../enum/placement.modify.type.enum';
import {MatDialog} from '@angular/material';
import {RemovingConfirmComponent} from '../../../../../shared/components/removing-confirm/removing-confirm.component';
import {UploadImageDialogComponent} from '../upload-image-dialog/upload-image-dialog.component';
import {RevertPlacementService} from '../../../../../shared/services/revert-placement.service';

@Component({
  selector: 'app-app-sub-menu',
  templateUrl: './app-sub-menu.component.html',
  styleUrls: ['./app-sub-menu.component.css']
})
export class AppSubMenuComponent implements OnInit {
  @Input() pageId = null;
  insertedAddress = '';
  setClear: boolean = false;
  @Input() canEdit = true;

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
      if (this.appSubMenuForm)
        this.appSubMenuForm.reset();
    }

    this.selectedSection = value || null;
    if (value)
      this.getRelatedItems();
  }

  @Output() modifyPlacement = new EventEmitter();

  itemBagName = 'app-sub-menu-bag';
  appSubMenuForm: FormGroup = null;
  selectedSection = null;
  selectedItem = null;
  filteredSubMenuItems = {};
  subMenuItems = [];
  anyChanges = false;
  selectedSectionSubMenu = null;
  moveButtonsShouldDisabled = false;
  imageUrlAddress = null;
  newPlacementId = null;

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
              private progressService: ProgressService, private sanitizer: DomSanitizer,
              private dialog: MatDialog, private revertService: RevertPlacementService) {
  }

  ngOnInit() {
    if (!this.dragulaService.find(this.itemBagName))
      this.dragulaService.setOptions(this.itemBagName, {
        direction: 'vertical',
        moves: () => {
          return this.canEdit;
        }
      });

    this.dragulaService.dropModel.subscribe(value => {
      if (this.itemBagName === value[0])
        this.changeItemOrder();
    });

    this.initForm();

    this.appSubMenuForm.valueChanges.subscribe(
      () => this.fieldChanged()
    );
  }

  initForm() {
    this.appSubMenuForm = new FormBuilder().group({
      text: [null, [
        Validators.required,
      ]],
      href: [null],
      section: [null],
      new_section: [null],
      is_header: [false],
    }, {
      validator: this.checkEnteredSection,
    });
  }

  private checkEnteredSection(AC: AbstractControl) {
    const section = AC.get('section').value;
    const newSection = AC.get('new_section').value;

    if (!section && !newSection)
      AC.get('new_section').setErrors({noSection: true});
    else {
      AC.get('new_section').setErrors(null);
      return null;
    }
  }

  changeItemOrder() {
    let placementList = [];

    Object.keys(this.filteredSubMenuItems).forEach(section => {
      let rowCounter = 1;
      let orderIsChanged = false;
      this.filteredSubMenuItems[section].items.forEach(placement => {
        if (placement.info.row !== +rowCounter || placement.info.section.split('/')[1] !== section)
          orderIsChanged = true;

        placement.info.row = +rowCounter;
        rowCounter++;
        placement.info.section = this.selectedSection + '/' + section;
      });

      if (orderIsChanged)
        placementList = placementList.concat(this.filteredSubMenuItems[section].items);
    });

    if (placementList.length > 0) {
      this.progressService.enable();
      this.httpService.post('placement', {
        page_id: this.pageId,
        placements: placementList,
        is_app: true,
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

  getRelatedItems() {
    if (!this.selectedSection)
      return;

    this.filteredSubMenuItems = {};
    this.subMenuItems
      .filter(el => {
        if (el.info.section.split('/')[0].toLowerCase() === this.selectedSection.toLowerCase())
          return el;
      })
      .sort((a, b) => {
        if (!a.info.is_header && b.info.is_header)
          return 1;
        else if (a.info.is_header && !b.info.is_header)
          return -1;
        else {
          if (a.info.row > b.info.row)
            return 1;
          else if (a.info.row < b.info.row)
            return -1;
          return 0;
        }
      })
      .forEach(el => {
        const area = el.info.section.split('/')[1].toLowerCase();
        const column = el.info.column;

        if (!this.filteredSubMenuItems[area])
          this.filteredSubMenuItems[area] = {
            details: {},
            items: [],
          };

        if (el.info.is_header)
          this.filteredSubMenuItems[area].details = el;
        else
          this.filteredSubMenuItems[area].items.push(el);
      });

    // Sort items in items
    Object.keys(this.filteredSubMenuItems).forEach(el => this.sortItems(this.filteredSubMenuItems[el].items));
  }

  private sortItems(list) {
    list.sort((a, b) => {
      if (a.info.row > b.info.row)
        return 1;
      else if (a.info.row < b.info.row)
        return -1;

      return 1;
    });
  }

  selectItem(value) {
    if (this.revertService.getRevertMode() && !this.canEdit) {
      this.revertService.select(value.component_name + (value.variable_name ? '-' + value.variable_name : ''), value);
    } else if (this.canEdit) {
      this.selectedItem = value;
      this.selectedItem.info.is_header = this.selectedItem.info.is_header || false;
      this.setFormValue(value.info);
      this.anyChanges = false;
    }
  }

  isSelectedToRevert(value, type) {
    if (type === 'item')
      return this.revertService.isSelected(value.component_name + (value.variable_name ? '-' + value.variable_name : ''), value._id);
    else if (type === 'section') {
      const item = this.filteredSubMenuItems[value].details;
      return this.revertService.isSelected(item.component_name + (item.variable_name ? '-' + item.variable_name : ''), item._id);
    }
  }

  setFormValue(value = null) {
    if (!value) {
      this.appSubMenuForm.reset();
      this.appSubMenuForm.controls['is_hader'].enable();
    } else {
      this.appSubMenuForm.controls['text'].setValue(value.text);
      this.insertedAddress = value.href;
      this.appSubMenuForm.controls['section'].setValue(value.section.split('/')[1]);
      this.appSubMenuForm.controls['is_header'].setValue(value.is_header ? value.is_header : false);
      if (value.is_header)
        this.appSubMenuForm.controls['is_header'].disable();
    }
  }

  modifyItem() {
    this.progressService.enable();
    (this.selectedItem ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [{
        _id: this.selectedItem._id,
        info: this.getItemInfo(),
      }],
      is_app: true
    }) : this.httpService.put('placement', {
      page_id: this.pageId,
      placement: {
        _id: this.newPlacementId ? this.newPlacementId : null,
        component_name: 'menu',
        variable_name: 'subMenu',
        info: this.getItemInfo(true),
      },
      is_app: true,
    })).subscribe(
      (data: any) => {
        this.modifyPlacement.emit({
          type: this.selectedItem ? PlacementModifyEnum.Modify : PlacementModifyEnum.Add,
          placement_id: data.placement_id,
          placements: [this.selectItem],
          placement: data.new_placement,
        });

        if (this.selectedItem) {
          const newInfo = this.getItemInfo();
          const changedObj = this.subMenuItems.find(el => el._id === this.selectedItem._id);
          changedObj.info.text = newInfo.text;
          changedObj.info.insertedAddress = newInfo.insertedAddress;
          changedObj.info.section = newInfo.section;
          changedObj.info.is_header = newInfo.is_header;
        } else {
          const newInfo = this.getItemInfo(true);
          this.selectedItem = data.new_placement;
        }

        this.anyChanges = false;
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot upsert an item: ', err);
        this.progressService.disable();
      }
    );
  }

  private getItemInfo(isNewItem = false): any {
    const res = {
      text: (this.appSubMenuForm.controls['text'].value ? this.appSubMenuForm.controls['text'].value : '').trim(),
      href: (this.insertedAddress ? this.insertedAddress : '').trim(),
      is_header: this.appSubMenuForm.controls['is_header'].value,
      imgUrl: isNewItem ? this.imageUrlAddress : this.selectedItem.info.imgUrl,
    };

    const section = this.appSubMenuForm.controls['new_section'].value ?
      this.appSubMenuForm.controls['new_section'].value :
      this.appSubMenuForm.controls['section'].value;

    res['section'] = this.selectedSection + '/' + section;

    // Check to findout assign new row number or not
    if (!this.selectedItem) {
      if (res.is_header) {
        res['row'] = Math.max(...Object.keys(this.filteredSubMenuItems).map(el => this.filteredSubMenuItems[el].details.info.row)) + 1;
      } else {
        res['row'] = Math.max(...this.filteredSubMenuItems[section].items.map(el => el.info.row)) + 1;
      }
    } else if (this.selectedItem.info.section.toLowerCase() !== section.toLowerCase()) {
      if (!res.is_header) {
        res['row'] = Math.max(...this.filteredSubMenuItems[section].items.map(el => el.info.row)) + 1;
      }
    }

    return res;
  }

  removeItem() {
    if (!this.selectedItem || !this.selectedItem._id)
      return;

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });

    this.progressService.enable();
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.httpService.post('placement/delete', {
            page_id: this.pageId,
            placement_id: this.selectedItem._id,
          }).subscribe(
            (data) => {
              this.modifyPlacement.emit({
                type: PlacementModifyEnum.Delete,
                placement_id: this.selectedItem._id,
              })
              this.progressService.disable();
            },
            (err) => {
              console.error('Cannot remove an item from sub menu of my_shop: ', err);
              this.progressService.disable();
            }
          );
        }
      }
    );
  }

  private fieldChanged() {
    this.setClear = false;
    if (!this.selectedItem) {
      this.anyChanges = !this.appSubMenuForm.controls['is_header'].value || !!this.imageUrlAddress;
      return;
    }

    this.anyChanges = false;

    ['text', 'href', 'is_header'].forEach(el => {
      if (this.selectedItem.info[el] !== this.appSubMenuForm.controls[el].value) {
        this.anyChanges = true;
        return;
      }
    });

    if ((this.selectedSection + '/' + this.appSubMenuForm.controls['section'].value) !== this.selectedItem.info.section)
      this.anyChanges = true;
  }

  clearFields() {
    this.setClear = true;
    this.appSubMenuForm.reset();
    this.selectedItem = null;
    this.appSubMenuForm.controls['is_header'].enable();
  }

  getSectionList() {
    return Object.keys(this.filteredSubMenuItems);
  }

  getImage(url) {
    if (url) {
      url = url[0] === '/' ? url : '/' + url;
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + url);
    }
    return '';
  }

  showSubItems(section) {
    if (this.revertService.getRevertMode() && !this.canEdit) {
      const id = this.filteredSubMenuItems[section].details._id;
      this.revertService.select('app-sub-menu', this.filteredSubMenuItems[section].details);
    } else {
      this.selectedSectionSubMenu = this.selectedSectionSubMenu === section ? null : section;
      this.selectItem(this.filteredSubMenuItems[section].details);
    }
  }

  uploadImage() {
    const uploadImgDialog = this.dialog.open(UploadImageDialogComponent, {
      width: '550px',
      data: {
        pageId: this.pageId,
        placementId: this.selectedItem ? this.selectedItem._id : null,
      },
      disableClose: true,
    });

    uploadImgDialog.afterClosed().subscribe(
      (data) => {
        if (data) {
          this.imageUrlAddress = data.downloadURL;
          if (this.selectedItem)
            this.selectedItem.info.imgUrl = this.imageUrlAddress;
          this.newPlacementId = data.placement_id ? data.placement_id : null;

          this.anyChanges = true;
        }
      }
    );
  }

  move(moveToBottom = false, section) {
    const tempCurIndex = Object.keys(this.filteredSubMenuItems).indexOf(section);
    const postPreRowSection =
      this.filteredSubMenuItems[Object.keys(this.filteredSubMenuItems)[tempCurIndex + (moveToBottom ? 1 : -1)]].details;
    const curRowSection = this.filteredSubMenuItems[section].details;

    const tempRow = postPreRowSection.info.row;
    postPreRowSection.info.row = curRowSection.info.row;
    curRowSection.info.row = tempRow;

    this.progressService.enable();
    this.moveButtonsShouldDisabled = true;
    this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [postPreRowSection, curRowSection],
      is_app: true,
    }).subscribe(
      (data: any) => {
        this.modifyPlacement.emit({
          type: PlacementModifyEnum.Modify,
          placements: [postPreRowSection, curRowSection]
        });
        this.moveButtonsShouldDisabled = false;
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot update the order of section: ', err);
        this.moveButtonsShouldDisabled = false;
        this.progressService.disable();
      });
  }

  @HostListener('document:keydown.control', ['$event'])
  keydown(event: KeyboardEvent) {
    this.revertService.setRevertMode(true);
  }

  @HostListener('document:keyup.control', ['$event'])
  keyup(event: KeyboardEvent) {
    this.revertService.setRevertMode(false);
  }
}
