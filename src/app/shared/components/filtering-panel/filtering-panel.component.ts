import {Component, OnInit} from '@angular/core';
import {PlacementService} from '../../services/placement.service';

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
      values : ['کفش', 'لباس', 'عینک', 'کوله ورزشی'],
    },
    {
      name: 'قیمت',
      values : ['زیر 200 هزار تومان', 'از 200 هزار تومان تا 500 هزار تومان', 'بالای 500 هزار تومان'],
    },
    {
      name: 'سایز',
      values : ['6', '6.5', '7', '8', '8.5', '9', '10', '10.5', '11', '12', '12.5', '13', '13.5', '5', '14'],
    },
    {
      name: 'رنگ',
      values: ['#254867', '#101215', '#FFD72E', '#7CFF1B', '#FF7912', '#FFC3A8', '#FFC300', '#FFC344', '#FF00A8', '#1155A8', '#778F1B', '#FF7AD2', '#FFC322', '#5FC300', '#3FC344', '#FFAAA8', '#1003A8']
    }
  ];
  current_filter_state = [];
  clear_box = null;
constructor(private placementService: PlacementService) {
  }

  constructor() { }
  ngOnInit() {
    // for(let i=0;i<400;i++)this.items.push(i+1);
  this.filter_options.forEach(el => {
    const tempObj = {name : '', values: []};
    tempObj.name = el.name;
    this.current_filter_state.push(tempObj);
  })
    console.log('filter_options : ', this.current_filter_state);
  }

  getValue(name, value) {
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
    // console.log('===>', this.current_filter_state);
  }

  clearFilters() {
    this.current_filter_state.forEach(el => {
      el.values = [];
    });
    this.clear_box = false;
    // console.log('--->', this.current_filter_state);
  }
}
