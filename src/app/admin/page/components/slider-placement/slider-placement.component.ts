import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../shared/services/http.service';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../shared/services/progress.service';
import {PlacementModifyEnum} from '../../enum/placement.modify.type.enum';

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
      // console.log('new placement received!');
      this.sliders = value;
      this.changeField();
    }
  }

  @Output() modifyPlacement = new EventEmitter();

  sliders: IPlacement[] = [];
  upsertSlider = {
    text: '',
    href: '',
    id: null,
    column: null,
    isEdit: false,
    //image
  };
;
  sliderChanged = false;

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
              private progressService: ProgressService) {
  }

  ngOnInit() {
    // setTimeout(() => console.log("placements:", this._placements), 2000);
    this.clearFields();

    this.dragulaService.setOptions('slider-bag', {
      direction: 'vertical',
    });

    this.dragulaService.dropModel.subscribe(value => {
      console.log('drag value', value);
      this.changeSliderOrder(value.slice(1));
    });
  }

  changeSliderOrder(args) {
    // console.log('change order detected');
    const [element, target, source] = args;

    let counter = 0;
    Object.keys(target.children).forEach(child => {
      const obj = this.sliders.find(el => el.info.text === target.children[child].innerText);
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
        this.modifyPlacement.emit({
          type: PlacementModifyEnum.Modify,
          placements: this.sliders,
        });
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.log('error occured in changing order', err);
      }
    );
  }

  changeField() {
    // console.log('sliders:', this.sliders);
    // console.log('and upsert:', this.upsertSlider);
    const text = this.upsertSlider ? this.upsertSlider.text.trim().toLowerCase() : '';
    const href = this.upsertSlider ? this.upsertSlider.href.trim().toLowerCase() : '';

    if (this.upsertSlider && this.upsertSlider.isEdit && text && href &&
      this.sliders.findIndex(el => el.info.text.toLowerCase() === text && el.info.href.toLowerCase() === href) === -1)
      this.sliderChanged = true;
    else
      this.sliderChanged = false;
    // console.log('final sliderChanged value:', this.sliderChanged);
  }

  clearFields() {
    console.log('cleared up');
    this.upsertSlider = {
      text: '',
      href: '',
      id: null,
      column: null,
      isEdit: false,
      //image
    };
  }

  selectItem(value) {
    console.log('selected item:', value);
    this.upsertSlider = {
      text: value.info.text,
      href: value.info.href,
      id: value._id,
      column: null,
      isEdit: true,
    };
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
          this.modifyPlacement.emit({
            type: PlacementModifyEnum.Delete,
            placement_id: this.sliders[index]._id,
          });
          this.upsertSlider = {
            text: '',
            href: '',
            id: null,
            column: null,
            isEdit: false,
          };
          this.progressService.disable();
        },
        err => {
          this.progressService.disable();
        }
      );
  }

  modifyItem(isEdit) {
    console.log('OnModify, isEdit:', isEdit);
    this.progressService.enable();
    (isEdit ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: this.upsertSlider.id,
          info: {
            text: this.upsertSlider.text,
            href: this.upsertSlider.href,
            column: this.upsertSlider.column,
            //image, styling
          }
        }
      ]
    }) : this.httpService.put('placement', {
      page_id: this.pageId,
      placement: {
        component_name: 'slider',
        variable_name: 'slider',
        info: {
          text: this.upsertSlider.text,
          href: this.upsertSlider.href,
          column: Math.max(...this.sliders.map(el => el.info.column)) + 1,
          //image, styling
        }
      }
    })).subscribe(
      data => {
        console.log('DATA:', data);

        this.modifyPlacement.emit({
          type: isEdit ? PlacementModifyEnum.Modify : PlacementModifyEnum.Add,
          placement_id: data._id,
          placements: [this.upsertSlider],
          placement: data.placement,
        });

        if (isEdit) {
          const changeObj = this.sliders.find(el => el._id.toString() === this.upsertSlider.id.toString());
          changeObj.info.text = this.upsertSlider ? this.upsertSlider.text : '';
          changeObj.info.href = this.upsertSlider ? this.upsertSlider.href : '';
        } else {
          this.upsertSlider.isEdit = true;
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

  sliderApplyDisability() {
    if (this.upsertSlider.isEdit) {
      return !this.sliderChanged || (!this.upsertSlider.text || !this.upsertSlider.href);
    } else {
      return !this.upsertSlider.text || !this.upsertSlider.href;
    }
  }
}
