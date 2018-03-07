import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ResponsiveService} from '../../services/responsive.service';

@Component({
  selector: 'app-filtering-panel',
  templateUrl: './filtering-panel.component.html',
  styleUrls: ['./filtering-panel.component.css']
})
export class FilteringPanelComponent implements OnInit {
  filter_options = [
    {
      name: 'برند',
      values: ['آدیداس', 'پلیس', 'نایک', 'گپ'],
    },
    {
      name: 'نوع',
      values: ['کفش', 'لباس', 'عینک', 'کوله ورزشی'],
    },
    {
      name: 'قیمت',
      values: ['زیر 200 هزار تومان', 'از 200 هزار تومان تا 500 هزار تومان', 'بالای 500 هزار تومان'],
    },
    {
      name: 'سایز',
      values: ['6', '6.5', '7', '8', '8.5', '9', '10', '10.5', '11', '12', '12.5', '13', '13.5', '5', '14'],
    },
    {
      name: 'رنگ',
      values: ['#254867', '#101215', '#FFD72E', '#7CFF1B', '#FF7912', '#FFC3A8', '#FFC300', '#FFC344', '#FF00A8', '#1155A8', '#778F1B', '#FF7AD2', '#FFC322', '#5FC300', '#3FC344', '#FFAAA8', '#1003A8']
    }
  ];
  current_filter_state = [];
  clear_box = null;
  isMobile = false;
  @Output() displayFilterEvent = new EventEmitter<any>();
  isChecked: any = {};
  oppositeColor: any = {};

  constructor(private responsiveService: ResponsiveService) {
  }

  ngOnInit() {
    this.filter_options.forEach(el => {
      const tempObj = {name: '', values: []};
      tempObj.name = el.name;
      this.current_filter_state.push(tempObj);
      this.isChecked[el.name] = {};
      for (const key of el.values) {
          this.isChecked[el.name][key] = false;
      }
    });

    for (const color in this.isChecked['رنگ']) {
      this.oppositeColor[color] = parseInt(color.substring(1), 16) < parseInt('888888', 16) ? 'white' : 'black';
    }
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    let sizes = this.filter_options.filter( r => r.name === 'سایز')[0];
    sizes.values = sizes.values.map( s => (+s).toLocaleString('fa'));
  }

  getValue(name, value) {
    this.isChecked[name][value] = !this.isChecked[name][value];
    this.current_filter_state.forEach(el => {
      if (el.name === name) {
        if (el.values.length === 0 || el.values.findIndex(i => i === value) === -1)
          el.values.push(value);
        else {
          const ind = el.values.indexOf(value);
          if (ind > -1)
            el.values.splice(ind, 1);
        }
      }
    });
    this.clear_box = null;
     console.log('===>', this.current_filter_state);
  }

  clearFilters() {
    this.current_filter_state.forEach(el => {
      el.values = [];
    });
    this.clear_box = false;

    for (const name in this.isChecked) {
      for (const value in this.isChecked[name]) {
        this.isChecked[name][value] = false;
      }
    }
  }

  changeDisplayFilter() {
    this.displayFilterEvent.emit(false);
  }
}
