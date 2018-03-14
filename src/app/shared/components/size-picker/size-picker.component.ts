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

@Component({
  selector: 'app-size-picker',
  templateUrl: './size-picker.component.html',
  styleUrls: ['./size-picker.component.css']
})
export class SizePickerComponent implements OnInit {
  sizeSplits = [];
  @Input()
  set sizes(productSizes) {
    this.sizeSplits = []
    while (productSizes.length) {
      this.sizeSplits.push(productSizes.splice(0, 5));
    }
  }
  @Output('value') value = new EventEmitter();
  val = 0;

  constructor() {
  }

  ngOnInit() {

  }

  onChange(e) {
    this.value.emit(+e.value);
    this.val = +e.value;
  }
}
