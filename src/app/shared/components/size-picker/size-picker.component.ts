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
  @Input() sizes;

  private _sizes;
  sizeses = [];
  @Output('value') value = new EventEmitter();
  val = 0;
  constructor() { }

  ngOnInit() {
    while (this.sizes.length) {
      this.sizeses.push(this.sizes.splice(0, 5));
    }
  }

  onChange(e) {
    this.value.emit(+e.value);
    this.val = +e.value;
  }
}
