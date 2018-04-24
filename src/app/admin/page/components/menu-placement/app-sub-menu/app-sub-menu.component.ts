import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IPlacement} from '../../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../../shared/services/progress.service';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {PlacementModifyEnum} from '../../../enum/placement.modify.type.enum';

@Component({
  selector: 'app-app-sub-menu',
  templateUrl: './app-sub-menu.component.html',
  styleUrls: ['./app-sub-menu.component.css']
})
export class AppSubMenuComponent implements OnInit {
  @Input() pageId = null;
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

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
    private progressService: ProgressService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (!this.dragulaService.find(this.itemBagName))
      this.dragulaService.setOptions(this.itemBagName, {
        direction: 'vertical',
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
      href: [null, [
        Validators.required,
      ]],
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

  }

  changeSectionOrder() {

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
    this.selectedItem = value;
    this.selectedItem.info.is_header = this.selectedItem.info.is_header || false;
    this.setFormValue(value.info);
    this.anyChanges = false;
  }

  setFormValue(value = null) {
    if (!value) {
      this.appSubMenuForm.reset();
      this.appSubMenuForm.controls['section'].enable();
    } else {
      this.appSubMenuForm.controls['text'].setValue(value.text);
      this.appSubMenuForm.controls['href'].setValue(value.href);
      this.appSubMenuForm.controls['section'].setValue(value.section.split('/')[1]);
      this.appSubMenuForm.controls['is_header'].setValue(value.is_header ? value.is_header : false);
    }
  }

  modifyItem() {

  }

  removeItem() {

  }

  private fieldChanged() {
    if (!this.selectedItem) {
      this.anyChanges = true;
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
    this.appSubMenuForm.reset();
    this.selectedItem = null;
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
    this.selectedSectionSubMenu = this.selectedSectionSubMenu === section ? null : section;
    this.selectItem(this.filteredSubMenuItems[section].details);
  }

  uploadImage() {
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
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot update the order of section: ', err);
        this.progressService.disable();
      }
    )
  }
}
