import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResponsiveService} from '../../services/responsive.service';
import {priceFormatter} from '../../lib/priceFormatter';
import {ProductService} from '../../services/product.service';
import {colorConverter} from '../../services/colorConverter';
import {DictionaryService} from '../../services/dictionary.service';

@Component({
  selector: 'app-filtering-panel',
  templateUrl: './filtering-panel.component.html',
  styleUrls: ['./filtering-panel.component.css']
})
export class FilteringPanelComponent implements OnInit {
  @Input() sortOptions;
  filter_options: any;
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
  minPrice = '0';
  maxPrice = '0';
  selectedMinPriceFormatted = '';
  selectedMaxPriceFormatted = '';

  constructor(private responsiveService: ResponsiveService, private productService: ProductService, private dict: DictionaryService) {
  }

  ngOnInit() {
    this.productService.filtering$.subscribe(r => {
      this.filter_options = r;
      this.filter_options.forEach(el => {
        const tempObj = {name: '', values: []};
        tempObj.name = el.name;
        this.current_filter_state.push(tempObj);
        this.isChecked[el.name] = {};
        for (const key of el.values) {
          this.isChecked[el.name][key] = false;
        }
      });
      const prices = r.find(fo => fo.name === 'price');
      if (prices) {
        this.minPrice = prices.values[0];
        this.maxPrice = prices.values[1];
        this.priceRangeChange();
      }

      for (const col in this.isChecked.color) {
        let color;
        color = this.dict.convertColor(col);
        if (color) {
          this.oppositeColor[col] = parseInt(color.substring(1), 16) < parseInt('888888', 16) ? 'white' : 'black';
          let red = color.substring(1, 3);
          let green = color.substring(3, 5);
          let blue = color.substring(5, 7);
          let colors = [red, green, blue];
          this.needsBorder[col] = colors.map(c => parseInt('ff', 16) - parseInt(c, 16) < 16).reduce((x, y) => x && y);
        } else {
          const delInd = this.filter_options.color.findIndex(c => c.name === col);
          this.filter_options.color.splice(delInd, 1);
        }
      }
      let sizes: any = this.filter_options.find(r => r.name === 'size');
      if (sizes) {
        sizes.values = sizes.values.map(s => +s ? (+s).toLocaleString('fa') : s);
      }
    });
    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);

  }

  priceRangeChange() {
    if (!this.rangeValues) {
      this.rangeValues = [this.minPrice, this.maxPrice];
    }
    this.rangeValues = this.rangeValues.map(r => Math.round(r / 1000) * 1000);
    this.current_filter_state.find(r => r.name === 'price').values = this.rangeValues;
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
