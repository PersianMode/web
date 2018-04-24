import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../shared/services/progress.service';
import {Pos} from './slider-preview/slider-preview.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-slider-placement',
  templateUrl: './slider-placement.component.html',
  styleUrls: ['./slider-placement.component.css']
})
export class SliderPlacementComponent implements OnInit {
  @Input() pageId = null;

  @Input()
  set placements(value: IPlacement[]) {
    if (value) {
      this.sliders = value;
      this.sliders.sort((a, b) => a.info.column > b.info.column ? 1 : (a.info.column < b.info.column ? -1 : 0));
      this.changeField();
    }
  }

  @Output() modifyPlacement = new EventEmitter();
  @Output() reloadPlacements = new EventEmitter();

  sliders: IPlacement[] = [];
  upsertSlider = {
    text: '',
    href: '',
    id: null,
    column: null,
    isEdit: false,
    imgUrl: null,
    style: {
      imgWidth: 40,
      imgMarginTop: 0,
      imgMarginLeft: 0,
    }
  };

  pos: Pos;

  imageChanged = false;
  sliderChanged = false;
  bagName = 'slider-bag';

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
              private progressService: ProgressService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.clearFields();

    if (!this.dragulaService.find(this.bagName))
      this.dragulaService.setOptions(this.bagName, {
        direction: 'vertical',
      });

    this.dragulaService.dropModel.subscribe(value => {
      console.log('value from changing order:', value);
      if (this.bagName === value[0])
        this.changeSliderOrder(value.slice(1));
    });
  }

  changeSliderOrder(args) {
    const [element, target, source] = args;

    let counter = 0;
    Object.keys(target.children).forEach(child => {
      const t = target.children[child].innerText;
      const obj = this.sliders.find(el => el.info.text.trim() == t.trim());
      if (obj) {
        obj.info.column = counter;
        counter++;
      }
    });
    this.progressService.enable();
    this.httpService.post('placement', {
      page_id: this.pageId,
      placements: this.sliders,
    }).subscribe(
      data => {
        // this.modifyPlacement.emit({
        //   type: PlacementModifyEnum.Modify,
        //   placements: this.sliders,
        // });
        this.reloadPlacements.emit();
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('error occurred in changing order', err);
      }
    );
  }

  changeField() {
    const text = this.upsertSlider ? this.upsertSlider.text.trim().toLowerCase() : '';
    const href = this.upsertSlider ? this.upsertSlider.href.trim().toLowerCase() : '';

    if (this.upsertSlider && this.upsertSlider.isEdit && text && href &&
      this.sliders.findIndex(el => el.info.text.toLowerCase() === text && el.info.href.toLowerCase() === href) === -1)
      this.sliderChanged = true;
    else
      this.sliderChanged = false;
  }

  clearFields() {
    this.upsertSlider = {
      text: '',
      href: '',
      id: null,
      column: null,
      isEdit: false,
      imgUrl: null,
      style: {
        imgWidth: 40,
        imgMarginTop: 0,
        imgMarginLeft: 0,
      }
    };

    this.pos = this.upsertSlider.style;
  }

  onImageUploaded(images: any) {
    if (this.upsertSlider.isEdit) {
      this.upsertSlider['imgUrl'] = images[0];
    } else {
      this.upsertSlider['imgUrl'] = images[0].downloadURL;
      this.upsertSlider['id'] = images[0].placementId;
    }

    this.reloadPlacements.emit();
  }

  selectItem(value) {
    this.upsertSlider = {
      text: value.info.text,
      href: value.info.href,
      id: value._id,
      column: value.info.column,
      isEdit: true,
      imgUrl: value.info.imgUrl,
      style: value.info.style || {
        imgWidth: 40,
        imgMarginLeft: 0,
        imgMarginTop: 0,
      },
    };
    this.pos = Object.assign({}, this.upsertSlider.style);
  }

  removeItem() {
    this.progressService.enable();
    const index = this.sliders.findIndex(
      el => el.info.text === this.upsertSlider.text && el.info.href === this.upsertSlider.href);
    if (index !== -1)
      this.httpService.post('placement/delete', {
        page_id: this.pageId,
        placement_id: this.sliders[index]._id,
      }).subscribe(
        data => {
          // this.modifyPlacement.emit({
          //   type: PlacementModifyEnum.Delete,
          //   placement_id: this.sliders[index]._id,
          // });
          this.reloadPlacements.emit();
          this.upsertSlider = {
            text: '',
            href: '',
            id: null,
            column: null,
            isEdit: false,
            imgUrl: null,
            style: {
              imgWidth: 40,
              imgMarginLeft: 0,
              imgMarginTop: 0,
            }
          };
          this.progressService.disable();
        },
        err => {
          this.progressService.disable();
          console.error('something went wrong', err);
        }
      );
  }

  modifyItem(isEdit) {
    const newPl = {
      component_name: 'slider',
      variable_name: 'slider',
      info: {
        text: this.upsertSlider.text.trim(),
        href: this.upsertSlider.href.trim(),
        column: Math.max(...this.sliders.map(el => el.info.column)) + 1,
        style: this.upsertSlider.style,
      }
    };
    if (!isEdit && this.upsertSlider.id) {
      newPl['_id'] = this.upsertSlider.id;
      newPl['info']['imgUrl'] = this.upsertSlider.imgUrl;
    }
    this.progressService.enable();
    (isEdit ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: this.upsertSlider.id,
          info: {
            text: this.upsertSlider.text.trim(),
            href: this.upsertSlider.href.trim(),
            imgUrl: this.upsertSlider.imgUrl,
            style: this.upsertSlider.style,
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
          this.upsertSlider.isEdit = true;
          this.upsertSlider.id = data.placement
            .find(el => el.info.text === this.upsertSlider.text &&
              el.info.href === this.upsertSlider.href)._id;
        } else {
          this.pos = Object.assign({}, this.upsertSlider.style);
          this.imageChanged = false;
        }
        this.changeField();
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('error in sending slider placement data', err);
      }
    );
  }

  /**
   * @param $event
   *    anyChanges: boolean,
   *    newStyle: Pos
   */
  imageSettingsChanged($event) {
    this.imageChanged = $event.anyChanges;
    this.upsertSlider.style = Object.assign({}, $event.newStyle);
  }

  sliderApplyDisability() {
    if (this.upsertSlider.isEdit) {
      return !((this.imageChanged || this.sliderChanged) && (this.upsertSlider.text && this.upsertSlider.href));
    } else {
      return !(this.upsertSlider.text && this.upsertSlider.href);
    }
  }

  getThisPlacement() {
    return {
      component_name: 'slider',
      variable_name: 'slider',
    };
    // return this.sliders
    //   .filter(e => e._id === this.upsertSlider.id)
    //   .map(e => {
    //     return {
    //       component_name: e.component_name,
    //       variable_name: e.variable_name || 'slider',
    //     };
    //   })[0];
  }

  getURL(path) {
    if (path) {
      if (path[0] !== '/')
        path = '/' + path;
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
    }
  }
}
