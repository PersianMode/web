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
export class SizePickerComponent implements OnInit, OnChanges {
  @Input() sizes;

  private _sizes;
  sizeses = [];
  @Output('value') value = new EventEmitter();
  val = 0;

  constructor() {
  }

  ngOnInit() {

  }

  onchange(e) {
    this.value.emit(+e.value);
    this.val = +e.value;
  }

  ngOnChanges(changes: SimpleChanges) {

    const sizes: SimpleChange = changes.sizes;

    this.sizeses = [];
    if (changes.sizes.currentValue.length > 0) {
      let _sizeArr = changes.sizes.currentValue;
      for (let i = 0; i < _sizeArr.length; i++) {
        this.sizeses.push(_sizeArr.splice(0, 5))
      }
    }

  }
}
