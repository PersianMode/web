import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TargetEnum} from '../../enum/target.enum';

enum ElementEnum {
  isApp,
}

@Component({
  selector: 'app-search-fields',
  templateUrl: './search-fields.component.html',
  styleUrls: ['./search-fields.component.css']
})
export class SearchFieldsComponent implements OnInit {

  @Input() target = null;

  @Input()
  set initItems(value) {
    this._initItems = value;
    this.setInitSearchData();
  }

  get initItems() {
    return this._initItems;
  }

  @Output() searching = new EventEmitter<any>();

  targets = [];
  targetList = [];
  searchCtrl = new FormControl();
  targetEnum = TargetEnum;
  elementEnum = ElementEnum;
  phrase = null;
  isApp = null;
  _initItems: any = null;



  constructor() {
  }

  ngOnInit() {
    this.searchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.phrase = data.trim() !== '' ? data.trim() : null;
        this.searchOnData();

      }, err => {
        console.log('Couldn\'t refresh', err);
      }
    );

  }

  addTarget(target_index) {

  }

  removeTarget(trg) {

  }

  searchOnData(phrase?) {
    if (!phrase) {
      phrase = this.phrase;
    }
    const trg = {};
    this.targets.forEach(el => {
      trg[el] = true;
    });

    const searchData = {
      options: {
        phrase: phrase,
        is_app: this.isApp,
        show_all: (this.target
          && (phrase === null || phrase === '')
          && this.isApp === null),
      }
    };
    this.searching.emit(searchData);
  }

  changeState(element) {
    switch (element) {
      case this.elementEnum.isApp: {
        if (this.isApp === null)
          this.isApp = true;
        else if (this.isApp === true)
          this.isApp = false;
        else if (this.isApp === false)
          this.isApp = null;
      }
        break;
    }

    this.searchOnData();
  }

  setInitSearchData() {
    if (this.initItems) {
      this.searchCtrl.setValue(this.initItems.phrase ? this.initItems.phrase : null);
      this.phrase = this.initItems.phrase ? this.initItems.phrase : null;
      this.isApp = this.initItems.options.is_app ? this.initItems.options.is_app : null;
    }
  }
}
