import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResponsiveService} from '../../services/responsive.service';
import {priceFormatter} from '../../lib/priceFormatter';
import {ProductService} from '../../services/product.service';
import {colorConverter} from './colorConverter';

@Component({
  selector: 'app-filtering-panel',
  templateUrl: './filtering-panel.component.html',
  styleUrls: ['./filtering-panel.component.css']
})
export class FilteringPanelComponent implements OnInit {
  @Input() sortOptions;
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
      values: [95e3, 5e6],
    },
    {
      name: 'سایز',
      values: ['6', '6.5', '7', '8', '8.5', '9', '10', '10.5', '11', '12', '12.5', '13', '13.5', '5', '14'],
    },
    {
      name: 'رنگ',
      values: ['#f8f8f8', '#f0f0f0', '#fffff0', '#ffe0ff', '#efefef', '#254867', '#101215', '#FFD72E', '#7CFF1B', '#FF7912', '#FFC3A8', '#FFC300', '#FFC344', '#FF00A8', '#1155A8', '#778F1B', '#FF7AD2', '#FFC322', '#5FC300', '#3FC344', '#FFAAA8', '#1003A8']
    }
  ];
  current_filter_state = [];
  clear_box = null;
  isMobile = false;
  sortedBy: any;
  @Output() displayFilterEvent = new EventEmitter<any>();
  @Output() sortedByChange = new EventEmitter<any>();
  isChecked: any = {};
  oppositeColor: any = {};
  needsBorder: any = {};
  expanded: any = {};
  rangeValues: any;
  minPrice = 5e5;
  maxPrice = 2.5e6;
  selectedMinPriceFormatted = '';
  selectedMaxPriceFormatted = '';

  constructor(private responsiveService: ResponsiveService, private productService: ProductService) {
  }

  ngOnInit() {
    //  this.productService.filtering$.subscribe(r => {
    // this.filter_options = r;
    this.filter_options.forEach(el => {
      const tempObj = {name: '', values: []};
      tempObj.name = el.name;
      this.current_filter_state.push(tempObj);
      this.isChecked[el.name] = {};
      for (const key of el.values) {
        this.isChecked[el.name][key] = false;
      }
    });

    for (const col in this.isChecked['رنگ']) {
      let color;
      try {
        color = colorConverter(col);
      } catch (e) {
        console.log(col, e);
      }
      if (color) {
        this.oppositeColor[col] = parseInt(color.substring(1), 16) < parseInt('888888', 16) ? 'white' : 'black';
        let red = color.substring(1, 3);
        let green = color.substring(3, 5);
        let blue = color.substring(5, 7);
        let colors = [red, green, blue];
        this.needsBorder[col] = colors.map(c => parseInt('ff', 16) - parseInt(c, 16) < 16).reduce((x, y) => x && y);
      }
    }
    const sizes: any = this.filter_options.filter(r => r.name === 'سایز')[0];
    sizes.values = sizes.values.map(s => +s ? (+s).toLocaleString('fa') : s);
    this.priceRangeChange();
    // });
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);

  }

  priceRangeChange() {
    if (!this.rangeValues) {
      this.rangeValues = [this.minPrice, this.maxPrice];
    }
    this.rangeValues = this.rangeValues.map(r => Math.round(r / 1000) * 1000);
    this.current_filter_state.find(r => r.name === 'قیمت').values = this.rangeValues;
    this.selectedMinPriceFormatted = priceFormatter(this.rangeValues[0]);
    this.selectedMaxPriceFormatted = priceFormatter(this.rangeValues[1]);
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

    this.sortedBy = null;
    this.sortedByChange.emit(this.sortedBy);
  }

  changeDisplayFilter() {
    this.displayFilterEvent.emit(false);
  }

  selectSortOption(index) {
    if (this.sortedBy && this.sortedBy.value === this.sortOptions[index].value) {
      this.sortedBy = null;
    } else {
      this.sortedBy = this.sortOptions[index];
    }
    this.sortedByChange.emit(this.sortedBy);
  }
}
