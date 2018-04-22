import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {DictionaryService} from '../../services/dictionary.service';

@Component({
  selector: 'app-size-picker',
  templateUrl: './size-picker.component.html',
  styleUrls: ['./size-picker.component.css']
})
export class SizePickerComponent implements OnInit {
  sizeSplits = [];

  @Input()
  set sizes(productSizes) {
    const temp = [];
    Object.assign(temp, productSizes);
    if (productSizes && productSizes.length) {
      productSizes.forEach((p, pi) => {
        temp[pi].displayValue = this.dict.translateWord(p.value);
      });
    }
    this.sizeSplits = [];
    while (temp && temp.length) {
      this.sizeSplits.push(temp.splice(0, 5));
    }
  }

  @Output('value') value = new EventEmitter();
  val = '';

  constructor(private dict: DictionaryService) {
  }

  ngOnInit() {
  }

  onChange(e) {
    this.val = e.value;
    this.value.emit(this.val);
  }
}
