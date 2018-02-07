import {Component, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {detectChanges} from "@angular/core/src/render3";

@Component({
  selector: 'app-size-picker',
  templateUrl: './size-picker.component.html',
  styleUrls: ['./size-picker.component.css']
})
export class SizePickerComponent implements OnInit {
  sizes = [
    {
      value: 12,
    },
    {
      value: 13,
    },
    {
      value: 14,
      disabled: true,
    },
    {
      value: 15,
    },
    {
      value: 16,
    },
    {
      value: 17,
    },
    {
      value: 18,
    },
    {
      value: 19,
    },
    {
      value: 20,
    },
    {
      value: 21,
    },
    {
      value: 22,
    },
    {
      value: 23,
    },
    {
      value: 24,
      disabled: true,
    },
    {
      value: 25,
    },
    {
      value: 26,
    },
    {
      value: 27,
    },
    {
      value:28,
    },
    {
      value: 29,
    },
    {
      value: 30,
    },
    {
      value: 31,
    },

  ];
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
    detectChanges(this);
  }
}
