import {Component, OnInit} from '@angular/core';
import {filter_optionsEnum} from '../../enum/filter_options.enum';
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
  selected_color = [];
  selected_size = [];
  current_filter_state = [];
  is_test = null;
constructor(private placementService: PlacementService) {
  }

  ngOnInit() {
  this.filter_options.forEach(el => {
    const tempObj = {name : '', values: []};
    tempObj.name = el.name;
    this.current_filter_state.push(tempObj);
  })
    console.log('****', this.current_filter_state);
  }

  getColor(name, colorCode) {
    this.is_test = null;
    if (this.selected_color.findIndex(c => c === colorCode) === -1)
      this.selected_color.push(colorCode);
    else {
      const ind = this.selected_color.indexOf(colorCode);
      if (ind > -1)
        this.selected_color.splice(ind, 1);
    }
    this.current_filter_state.forEach(el => {
      if (el.name === name) {
        el.values = this.selected_color;
      }
    });
  }

  getSize(name, sizeNumber) {
    this.is_test = null;
    if (this.selected_size.findIndex(s => s === sizeNumber) === -1)
      this.selected_size.push(sizeNumber);
    else {
      const ind = this.selected_size.indexOf(sizeNumber);
      if (ind > -1)
        this.selected_size.splice(ind, 1);
    }
    this.current_filter_state.forEach(el => {
      if (el.name === name) {
        el.values = this.selected_size;
      }
    });
  }

  getValue(name, value) {
    this.is_test = null;
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
    })
    console.log('===>>', this.current_filter_state);
  }

  clearFilters() {
    this.current_filter_state.forEach(el => {
      el.values = [];
    });
    // this.filter_options.forEach(el => {
    //   el.values = [];
    // });
    console.log(this.current_filter_state);
    this.is_test = false;
  }
  //
  //   if (name === 'برند') {
  //     if (this.selected_brand.findIndex(el => el === value) === -1)
  //       this.selected_brand.push(value);
  //     else {
  //       const ind = this.selected_brand.indexOf(value);
  //       if (ind > -1)
  //         this.selected_brand.splice(ind, 1);
  //     }
  //
  //     this.current_filter_state.forEach(el => {
  //       if (el.name === name) {
  //         el.values = this.selected_brand;
  //       }
  //     });
  //   }
  //   else if (name === 'نوع') {
  //     if (this.selected_type.findIndex(el => el === value) === -1)
  //       this.selected_type.push(value);
  //     else {
  //       const ind = this.selected_type.indexOf(value);
  //       if (ind > -1)
  //         this.selected_type.splice(ind, 1);
  //     }
  //
  //     this.current_filter_state.forEach(el => {
  //       if (el.name === name) {
  //         el.values = this.selected_type;
  //       }
  //     });
  //   }
  //   console.log('===>>', this.current_filter_state);
  // }
}
