import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-dob',
  templateUrl: './dob.component.html',
  styleUrls: ['./dob.component.css']
})
export class DobComponent implements OnInit {
  years = [];
  months = [];
  days = [];
  year;
  month;
  day;
  @Input()
  set date(date: Date){
    if (date) {
      this.day = moment(date).jDate();
      this.month = moment(date).jMonth() + 1;
      this.correctDaysInMonth(moment(date));
      this.year = moment(date).jYear();
    }
  }

  @Output() change = new EventEmitter();

  constructor() {
    const year = moment().jYear();
    for (let i = year - 100; i < year - 17; i ++) {
      this.years.push({index: i, value: i.toLocaleString('fa', {useGrouping: false})});
    }
    this.years.reverse();
    'فروردین اردیبهشت خرداد تیر مرداد شهریور مهر آبان آذر دی بهمن اسفند'.split(' ').forEach((m, i) =>{
      this.months.push({index: i + 1, value: m});
    });
    this.initDates();
  }

  ngOnInit() {
  }

  initDates(maxDate = 31) {
    this.days = [];
    for (let i = 1 ; i < maxDate + 1; i ++) {
      this.days.push({index: i, value: i.toLocaleString('fa')});
    }
  }

  onChange() {
    if (this.year && this.month && this.day) {
      const x = moment();
      x.jYear(this.year);
      x.jMonth(this.month - 1);
      this.correctDaysInMonth(x);
      x.jDate(this.day);
      x.hour(0);
      x.minute(0);
      x.second(0);
      x.millisecond(0);
      this.change.emit(x.toDate());
    } else {
      this.change.emit(null);
    }
  }

  private correctDaysInMonth(x: moment.Moment) {
    if (this.month > 6 && this.month < 12)
      this.initDates(30);
    else if (this.month <= 6)
      this.initDates(31);
    else if (this.month === 12) {
      if (x.jIsLeapYear())
        this.initDates(30);
      else
        this.initDates(29);
    }
  }
}
