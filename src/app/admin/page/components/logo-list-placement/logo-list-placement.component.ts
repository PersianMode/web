import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../shared/services/progress.service';
import {DomSanitizer} from '@angular/platform-browser';
import {LogoPos} from '../../../../shared/components/logo-header/logo-header.component';
import {PlacementModifyEnum} from '../../enum/placement.modify.type.enum';

@Component({
  selector: 'app-logo-list-placement',
  templateUrl: './logo-list-placement.component.html',
  styleUrls: ['./logo-list-placement.component.css']
})
export class LogoListPlacementComponent implements OnInit {
  @Input() pageId = null;

  @Input()
  set placements(value) {
    if (value) {
      this.logos = value;
      this.logos.sort((a, b) => a.info.column > b.info.column ? 1 : (a.info.column < b.info.column ? -1 : 0));
      this.changeField();
    }
  }

  @Output() modifyPlacement = new EventEmitter();
  @Output() reloadPlacements = new EventEmitter();

  logos: IPlacement[] = [];
  upsertLogo = {
    text: '',
    href: '',
    id: null,
    column: null,
    isEdit: false,
    imgUrl: null,
    style: {
      width: 0,
      top: 0,
      right: 0,
      height: 0,
    }
  };

  pos: LogoPos;

  logoChanged = false;
  imageChanged = false;


  constructor(private httpService: HttpService, private dragulaService: DragulaService,
              private progressService: ProgressService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.clearFields();

    this.dragulaService.setOptions('logo-bag', {
      direction: 'horizontal',
    });

    this.dragulaService.dropModel.subscribe(value => {
      this.changeLogoOrder(value.slice(1));
    });
  }

  changeLogoOrder(args) {
    const [element, target, source] = args;

    let counter = 1;
    Object.keys(target.children).forEach(child => {
      const t = target.children[child].children[0].getAttribute('title');
      const obj = this.logos.find(el => el.info.text === t);
      if (obj) {
        obj.info.column = counter;
        counter++;
      }
    });
    this.progressService.enable();
    this.httpService.post('placement', {
      page_id: this.pageId,
      placements: this.logos,
    }).subscribe(
      data => {
        this.modifyPlacement.emit({
          type: PlacementModifyEnum.Modify,
          placements: this.logos,
        });
        // this.reloadPlacements.emit();
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('error occurred in changing order', err);
      }
    );
  }

  clearFields() {
    this.upsertLogo = {
      text: '',
      href: '',
      id: null,
      column: null,
      isEdit: false,
      imgUrl: null,
      style: {
        width: 0,
        top: 0,
        right: 0,
        height: 29,
      }
    };
    this.pos = this.upsertLogo.style;
  }

  changeField() {
    const text = this.upsertLogo ? this.upsertLogo.text.trim().toLowerCase() : '';
    const href = this.upsertLogo ? this.upsertLogo.href.trim().toLowerCase() : '';

    if (this.upsertLogo && this.upsertLogo.isEdit && text && href &&
      this.logos.findIndex(el => el.info.text.toLowerCase() === text && el.info.href.toLowerCase() === href) === -1)
      this.logoChanged = true;
    else
      this.logoChanged = false;
  }

  logoApplyDisability() {
    if (this.upsertLogo.isEdit) {
      return !this.imageChanged && (!this.logoChanged || (!this.upsertLogo.text || !this.upsertLogo.href));
    } else {
      return !this.upsertLogo.text || !this.upsertLogo.href;
    }
  }

  onImageUploaded(images: any) {
    if (images.length > 0) {
      this.upsertLogo['imgUrl'] = images[0];
      this.upsertLogo.isEdit = true;
      // TODO: should not be emitted! instead, the edit button should be enabled!
      this.reloadPlacements.emit();
    }
  }

  selectItem(value) {

  }

  modifyItem(isEdit) {

  }

  removeItem() {

  }

  getURL(path) {
    return `assets/logos/${path}`;
    if (path)
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }

}
