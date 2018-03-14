import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import {log} from 'util';
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
    if (productSizes && productSizes.length) {
      productSizes.forEach((p, pi) => {
        productSizes[pi].displayValue = this.dict.translateWord(p.value);
      });
    }
    this.sizeSplits = [];
    while (productSizes && productSizes.length) {
      this.sizeSplits.push(productSizes.splice(0, 5));
    }
  }
  @Output('value') value = new EventEmitter();
  val = 0;

  constructor(private dict: DictionaryService) {
  }

  ngOnInit() {

  }

  onChange(e) {
    this.value.emit(+e.value);
    this.val = +e.value;
  }
}
