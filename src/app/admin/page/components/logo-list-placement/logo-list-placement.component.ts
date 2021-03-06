import {Component, EventEmitter, Input, OnInit, Output, HostListener} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../shared/services/progress.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {RevertPlacementService} from '../../../../shared/services/revert-placement.service';

@Component({
  selector: 'app-logo-list-placement',
  templateUrl: './logo-list-placement.component.html',
  styleUrls: ['./logo-list-placement.component.css']
})
export class LogoListPlacementComponent implements OnInit {
  @Input() pageId = null;
  @Input() canEdit = true;
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

  logoChanged = false;
  imageChanged = false;
  bagName = 'logo-bag';

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
    private progressService: ProgressService, private sanitizer: DomSanitizer,
    private dialog: MatDialog, private revertService: RevertPlacementService) {
  }

  ngOnInit() {
    this.clearFields();

    if (!this.dragulaService.find(this.bagName))
      this.dragulaService.setOptions(this.bagName, {
        direction: 'horizontal',
        moves: () => {
          return this.canEdit;
        }
      });

    this.dragulaService.dropModel.subscribe(value => {
      if (this.bagName === value[0]) {
        this.changeLogoOrder(value.slice(1));
        this.clearFields();
      }
    });
  }

  changeLogoOrder(args) {
    const [element, target, source] = args;

    let counter = 1;
    Object.keys(target.children).forEach(child => {
      const t = target.children[child].children[0].getAttribute('title');
      const obj = this.logos.find(el => el.info.text.trim() == t.trim());
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
        this.reloadPlacements.emit();
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
        width: 60,
        top: 0,
        right: 0,
        height: 29,
      }
    };
  }

  changeField() {
    const text = this.upsertLogo && this.upsertLogo.text ? this.upsertLogo.text.trim().toLowerCase() : '';
    const href = this.upsertLogo && this.upsertLogo.href ? this.upsertLogo.href.trim().toLowerCase() : '';

    const curLogo = this.logos.find(el => el.info.text === this.upsertLogo.text && el.info.href === this.upsertLogo.href);
    if (curLogo) {
      const logoStyle = curLogo.info.style, upsertStyle = this.upsertLogo.style;
      const widthChange = (logoStyle && logoStyle.width || 60) === upsertStyle.width;
      const heightChange = (logoStyle && logoStyle.height || 29) === upsertStyle.height;
      const topChange = (logoStyle && logoStyle.top || 0) === upsertStyle.top;
      const rightChange = (logoStyle && logoStyle.right || 0) === upsertStyle.right;
      this.imageChanged = !(widthChange && heightChange && topChange && rightChange);
    } else {
      this.imageChanged = false;
    }

    if (this.upsertLogo && this.upsertLogo.isEdit && text && href &&
      this.logos.findIndex(el => el.info.text.toLowerCase() === text && el.info.href.toLowerCase() === href) === -1)
      this.logoChanged = true;
    else
      this.logoChanged = false;
  }

  logoApplyDisability() {
    if (this.upsertLogo.isEdit) {
      return !((this.imageChanged || this.logoChanged) && (this.upsertLogo.text && this.upsertLogo.href));
    } else {
      return !(this.upsertLogo.text && this.upsertLogo.href);
    }
  }

  onImageUploaded(images: any) {
    if (this.upsertLogo.isEdit) { // update -> images: string[]
      this.upsertLogo['imgUrl'] = images[0];
    } else { // add -> images: [{downloadURL, placementId}]
      this.upsertLogo['imgUrl'] = images[0].downloadURL;
      this.upsertLogo['id'] = images[0].placementId;
    }

    this.reloadPlacements.emit();
  }

  selectItem(value) {
    if (this.revertService.getRevertMode() && !this.canEdit) {
      this.revertService.select(value.component_name + (value.variable_name ? '-' + value.variable_name : ''), value);
    } else if (this.canEdit) {
      const style = value.info.style;
      this.upsertLogo = {
        text: value.info.text,
        href: value.info.href,
        id: value._id,
        column: value.info.column,
        isEdit: true,
        imgUrl: value.info.imgUrl,
        style: {
          width: style && typeof style.width !== 'undefined' && style.width !== null ? style.width : 60,
          height: style && typeof style.height !== 'undefined' && style.height !== null ? style.height : 29,
          top: style && typeof style.top !== 'undefined' && style.top !== null ? style.top : 0,
          right: style && typeof style.right !== 'undefined' && style.right !== null ? style.right : 0,
        }
      };
    }
  }

  isSelectedToRevert(item) {
    return this.revertService.isSelected(item.component_name + (item.variable_name ? '-' + item.variable_name : ''), item._id);
  }

  modifyItem(isEdit) {
    const newPl = {
      component_name: 'logos',
      variable_name: 'logos',
      info: {
        text: this.upsertLogo.text.trim(),
        href: this.upsertLogo.href.trim(),
        column: Math.max(...this.logos.map(el => el.info.column)) + 1,
        style: this.upsertLogo.style,
      }
    };
    if (!isEdit && this.upsertLogo.id) {
      newPl['_id'] = this.upsertLogo.id;
      newPl['info']['imgUrl'] = this.upsertLogo.imgUrl;
    }
    this.progressService.enable();
    (isEdit ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: this.upsertLogo.id,
          info: {
            text: this.upsertLogo.text.trim(),
            href: this.upsertLogo.href.trim(),
            imgUrl: this.upsertLogo.imgUrl,
            style: this.upsertLogo.style,
          }
        }
      ]
    }) : this.httpService.put('placement', {
      page_id: this.pageId,
      placement: newPl,
    })).subscribe(
      data => {
        this.reloadPlacements.emit();
        if (!isEdit) {
          this.upsertLogo.isEdit = true;
          this.upsertLogo.id = data.placement
            .find(el => el.info.text === this.upsertLogo.text &&
              el.info.href === this.upsertLogo.href)._id;
        } else {
          this.imageChanged = false;
        }
        this.changeField();
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('error in sending logo placement data', err);
      }
    );
  }

  removeItem() {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });

    rmDialog.afterClosed().subscribe(status => {
      if (status) {
        this.progressService.enable();
        const index = this.logos.findIndex(
          el => el.info.text === this.upsertLogo.text && el.info.href === this.upsertLogo.href);
        if (index !== -1)
          this.httpService.post('placement/delete', {
            page_id: this.pageId,
            placement_id: this.logos[index]._id,
          }).subscribe(
            data => {
              this.reloadPlacements.emit();
              this.clearFields();
              this.progressService.disable();
            },
            err => {
              this.progressService.disable();
              console.error('something went wrong', err);
            }
          );
      }
    });
  }

  getURL(path) {
    if (path) {
      if (path[0] !== '/')
        path = '/' + path;
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
    }
  }

  changePosition(pos, value) {
    this.upsertLogo.style[pos] += value;
    this.changeField();
  }

  getThisPlacement() {
    return {
      component_name: 'logos',
      variable_name: 'logos'
    };
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
