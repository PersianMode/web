import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ResponsiveService} from '../../services/responsive.service';
import {priceFormatter} from '../../lib/priceFormatter';
import {ProductService} from '../../services/product.service';
import {colorConverter} from '../../services/colorConverter';
import {DictionaryService} from '../../services/dictionary.service';
import * as ntc from 'ntcjs';

@Component({
  selector: 'app-filtering-panel',
  templateUrl: './filtering-panel.component.html',
  styleUrls: ['./filtering-panel.component.css']
})
export class FilteringPanelComponent implements OnInit, OnDestroy {
  @Input() sortOptions;
  filter_options: any;
  current_filter_state = [];
  clear_box = null;
  isMobile = false;
  sortedBy: any = {value: null};
  @Output() displayFilterEvent = new EventEmitter<any>();
  @Output() sortedByChange = new EventEmitter<any>();
  isChecked: any = {};
  oppositeColor: any = {};
  translatedColor: any = {};
  needsBorder: any = {};
  expanded: any = {};
  rangeValues: any;
  minPrice;
  maxPrice;
  selectedMinPriceFormatted = '';
  selectedMaxPriceFormatted = '';
  isEU = false;
  isEUSubescriber: any;
  discountRangeValues: any;
  minDiscount;
  maxDiscount;
  selectedMinDiscountFormatted = '';
  selectedMaxDiscountFormatted = '';

  filter_options$: any;


  constructor(private responsiveService: ResponsiveService, private productService: ProductService, private dict: DictionaryService) {
  }

  ngOnInit() {

    this.isEU = this.productService.collectionIsEU;
    this.isEUSubescriber = this.productService.collectionIsEUObject.subscribe(value => this.isEU = value);

    this.filter_options$ = this.productService.filtering$.subscribe(r => {
      this.filter_options = r;
      this.filter_options.forEach(el => {
        const found = this.current_filter_state.find(cfs => cfs.name === el.name);
        if (!found) {
          this.current_filter_state.push({name: el.name, values: []});
        }
        if (!this.isChecked[el.name]) {
          this.isChecked[el.name] = {};
          for (const key of el.values) {
            this.isChecked[el.name][key] = false;
          }
        }
      });
      const prices = r.find(fo => fo.name === 'price');
      if (prices && prices.values.length) {
        if (!this.minPrice)
          this.minPrice = prices.values[0];
        if (!this.maxPrice)
          this.maxPrice = prices.values[1];

        this.rangeValues = [prices.values[0], prices.values[1]];
        this.formatPrices();
      }

      const discount = r.find(fo => fo.name === 'discount');
      if (discount && discount.values.length) {
        if (!this.minDiscount)
          this.minDiscount = discount.values[0];
        if (!this.maxDiscount)
          this.maxDiscount = discount.values[1];

        this.discountRangeValues = [discount.values[0], discount.values[1]];
        this.formatDiscount();
      }

      for (const col in this.isChecked.color) {

          this.translatedColor[col] = ntc.name(this.dict.translateWord(col))[1];
        let color = this.translatedColor[col]
        if (color) {
          this.oppositeColor[col] = parseInt(color.substring(1), 16) < parseInt('888888', 16) ? 'white' : 'black';
          const red = color.substring(1, 3);
          const green = color.substring(3, 5);
          const blue = color.substring(5, 7);
          const colors = [red, green, blue];
          this.needsBorder[col] = colors.map(c => parseInt('ff', 16) - parseInt(c, 16) < 16).reduce((x, y) => x && y);
        } else {
          this.oppositeColor[col] = 'white';
        }
      }
      
    });

    this.isMobile = this.responsiveService.isMobile;
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
  }

  formatPrices() {
    [this.selectedMinPriceFormatted, this.selectedMaxPriceFormatted] = this.rangeValues.map(priceFormatter);
  }

  priceRangeChange() {
    this.rangeValues = this.rangeValues.map(r => Math.round(r / 1000) * 1000);
    this.current_filter_state.find(r => r.name === 'price').values = this.rangeValues;
    this.formatPrices();
    this.productService.applyFilters(this.current_filter_state, 'price');
    this.expanded.price = true;
  }

  changeSizeType(fo) {
    this.isChecked[fo] = [];
    this.productService.changeCollectionIsEU(this.current_filter_state);
  }

  shoesSize(size) {
    if (this.isEU)
      return this.dict.translateWord(size);
    return this.dict.USToEU(size, 'WOMENS');
  }

  getValue(name, value) {
    this.isChecked[name][value] = !this.isChecked[name][value];
    this.expanded[name] = true;
    Object.keys(this.isChecked).filter(r => r !== name && r !== 'price').forEach(k => {
      if (!Object.keys(this.isChecked[k]).map(r => this.isChecked[k][r]).reduce((x, y) => x || y, false)) {
        this.expanded[k] = false;
      }
    });

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
    this.productService.applyFilters(this.current_filter_state, name);
  }

  clearFilters() {
    this.current_filter_state.forEach(el => {
      el.values = [];
    });
    this.clear_box = false;

    for (const name in this.isChecked) {
      this.expanded[name] = false;
      for (const value in this.isChecked[name]) {
        this.isChecked[name][value] = false;
      }
    }

    this.sortedBy = null;
    this.sortedByChange.emit(this.sortedBy);

    this.productService.applyFilters(this.current_filter_state, '');
  }

  changeDisplayFilter() {
    this.displayFilterEvent.emit(false);
  }

  selectSortOption(index) {
    if (this.sortedBy && this.sortedBy.value === this.sortOptions[index].value) {
      this.sortedBy = {value: null};
    } else {
      this.sortedBy = this.sortOptions[index];
    }
    this.sortedByChange.emit(this.sortedBy);
  }

  ngOnDestroy(): void {
    this.filter_options$.unsubscribe();
    this.isEUSubescriber.unsubscribe();
  }

  formatDiscount() {
    [this.selectedMinDiscountFormatted, this.selectedMaxDiscountFormatted] = this.discountRangeValues.map(priceFormatter);
  }

  discountRangeChange() {
    this.current_filter_state.find(r => r.name === 'discount').values = this.discountRangeValues;
    this.formatDiscount();
    this.productService.applyFilters(this.current_filter_state, 'discount');
    this.expanded.discount = true;
  }
}
