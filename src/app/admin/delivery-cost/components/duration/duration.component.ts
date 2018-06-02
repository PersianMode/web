import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.css']
})
export class DurationComponent implements OnInit {
  deliveryDurations = [
    {name: 'سه روزه', value: 3},
    {name: 'پنج روزه', value: 5},
    {name: 'هفت روزه', value: 7}
  ];
  durationObject: any = {};

  @Output() selectedDuration = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  changeDuration(item) {
    this.durationObject = {
      name: item.name,
      value: item.value,
    };
    this.selectedDuration.emit(this.durationObject);
    console.log(this.durationObject);
  }
}
