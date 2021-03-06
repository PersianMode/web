import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ResponsiveService} from '../../services/responsive.service';
import {priceFormatter} from '../../lib/priceFormatter';
import {ProductService} from '../../services/product.service';
import {colorConverter} from '../../services/colorConverter';
import {DictionaryService} from '../../services/dictionary.service';
import * as ntc from 'ntcjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-filtering-panel',
  templateUrl: './filtering-panel.component.html',
  styleUrls: ['./filtering-panel.component.css']
})
export class FilteringPanelComponent implements OnInit, OnDestroy {
  @Input() sortOptions;
  private _c;

  @Input() get category() {
    return this._c
  };

  set category(value) {
    this._c = value;
    if (this.category || this.category === '') {
      this.categoryChecked(this.category);
      this.moreSides = true;
    }
    if (this.category === '') {
      this.sideOptionClicked('Category', null);
    }
  }

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
  isEU = true;
  isEUSubescriber: any;
  discountRangeValues: any;
  minDiscount;
  maxDiscount;
  selectedMinDiscountFormatted = '';
  selectedMaxDiscountFormatted = '';
  filter_options$: any;
  side_options$: any;
  collection_filter_options$: any;
  collection_filter_options: any;
  sideOptions: any[] = [];
  moreSides = false;
  allCount = '';
  lastSlideEventTime;
  curRange;
  parentCategories: any[] = [];
  parentData$;
  parentName;

  constructor(private responsiveService: ResponsiveService, private productService: ProductService,
              private dict: DictionaryService, private router: Router) {
  }

  ngOnInit() {
    this.collection_filter_options$ = this.productService.collectionFilterOptions$.subscribe(r => {
      this.collection_filter_options = r;
    });
    this.isEU = this.productService.collectionIsEU;
    this.isEUSubescriber = this.productService.collectionIsEUObject.subscribe(value => this.isEU = value);
    this.side_options$ = this.productService.side$.subscribe(r => {
      this.sideOptions = [];
      r.filter(o => o.name === 'Category')
        .forEach((o, i) => o.values.forEach((v, j) => {
          const count = this.productService.countProducts(o.name, v);
          if (count) {
            this.sideOptions.push({
              fa: o.values_fa[j],
              name: o.name,
              value: v,
              count,
              countFa: count.toLocaleString('fa'),
            });
          }
        }));
      this.sideOptions.sort((x, y) => y.count - x.count);
      if (this.sideOptions.findIndex(s => s.value === this.category) > 4) {
        this.moreSides = true;
      }
      this.isChecked.main = {all: true};
      this.allCount = this.productService.countProducts().toLocaleString('fa');
    });

    this.parentData$ = this.productService.parentData$.subscribe(r => {
      this.parentCategories = [];
      let allCount = 0;
      this.parentName = r.name;
      for (let category in r.categories) {
        const count = r.categories[category];
        allCount += count;
        this.parentCategories.push({
          name: category,
          nameFa: this.dict.translateWord(category),
          count,
          countFa: this.dict.translateWord(count),
        });
      }
      if (allCount) {
        this.parentCategories.push({
          name: r.name,
          nameFa: r.nameFa,
          count: allCount,
          countFa: this.dict.translateWord(allCount)
        })
      }
      this.parentCategories.sort((x, y) => {
        if (r.sortedCategories) {
          let xRank = r.sortedCategories.findIndex(s => s.toLowerCase() === x.name.toLowerCase());
          let yRank = r.sortedCategories.findIndex(s => s.toLowerCase() === y.name.toLowerCase());
          if (xRank !== -1) {
            if (yRank !== -1) {
              return xRank - yRank;
            } else {
              return -1;
            }
          } else if (yRank !== -1) {
            return 1;
          }
        }
        return y.count - x.count;
      });
    });
    this.filter_options$ = this.productService.filtering$.subscribe(r => {
      this.allCount = this.productService.countProducts().toLocaleString('fa');
      this.filter_options = r;
      this.filter_options.forEach(el => {
        if (this.sideOptions.length) {
          this.sideOptions.forEach(so => {
            so.count = this.productService.countProducts(so.name, so.value);
            so.countFa = so.count.toLocaleString('fa');
          });
        } else this.productService.side$.next(r);
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
        if (this.category) {
          this.categoryChecked( this.category)
        }
      });
      let prices: any = r.find(fo => fo.name === 'price');
      if (prices && prices.values.length) {
        prices = prices.values;
        this.minPrice = prices[0];
        this.maxPrice = prices[3];

        this.rangeValues = [prices[1], prices[2]];
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

      for (const col in this.isChecked.color) if (this.isChecked.color.hasOwnProperty(col)) {
        let color;
        color = this.dict.convertColor(col);
        if (this.dict.translateWord(col) !== 'نامعین') {
          this.translatedColor[col] = ntc.name(this.dict.translateWord(col))[1];
        }
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


  shouldShowOption(item) {
    if (this.collection_filter_options && this.collection_filter_options.length) {
      let tempItem = this.collection_filter_options.filter(el => el.name === item.name && el.name_fa === item.name_fa)
      if (tempItem && tempItem.length === 1)
        return tempItem[0].checked;
    }
    return true;
  }

  formatPrices() {
    [this.selectedMinPriceFormatted, this.selectedMaxPriceFormatted] = this.rangeValues.map(priceFormatter);
    if (this.isMobile) { // SliderEnd event doesn't work on mobile, this is to compensate
      if (!this.curRange)
        this.curRange = this.rangeValues.slice(0);
      const i = setInterval(() => {
        if (this.curRange &&
          (this.curRange[0] !== this.rangeValues[0] || this.curRange[1] !== this.rangeValues[1])) {
          clearInterval(i);
          this.curRange = null;
          this.lastSlideEventTime = null;
          this.priceRangeChange();
        }
      }, 1000);
    }
  }

  priceRangeChange() {
    this.rangeValues = this.rangeValues.map(r => Math.round(r / 1000) * 1000);
    this.current_filter_state.find(r => r.name === 'price').values = this.rangeValues;
    this.formatPrices();
    this.productService.applyFilters(this.current_filter_state, 'price', false);
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

  categoryChecked(category) {
    if (this.isChecked.Category && !this.isChecked.Category[category]) {
      this.sideOptionClicked('Category', category);
    }
  }

  sideOptionClicked(name, value) {
    for (const k1 in this.isChecked) if (this.isChecked.hasOwnProperty(k1)) {
      for (const k2 in this.isChecked[k1]) if (this.isChecked[k1].hasOwnProperty(k2)) {
        if (k1 === 'Category')
          if (k2 !== value) {
            if (this.isChecked[k1][k2]) {
              this.changeFilterState(k1, k2, false);
              this.isChecked[k1][k2] = false;
            }
          } else if (!this.isChecked[k1][k2]) {
            this.changeFilterState(k1, k2, false);
            this.isChecked[k1][k2] = true;
          }
      }
    }
  }

  parentCategoryClicked(name) {
      this.router.navigate(['/collection', this.parentName], {queryParams: {category: name !== this.parentName ? name : ''}, queryParamsHandling: 'merge'});
    }

  getValue(name, value) {
    this.isChecked[name][value] = !this.isChecked[name][value];
    this.expanded[name] = true;
    Object.keys(this.isChecked).filter(r => r !== name && r !== 'price').forEach(k => {
      if (!Object.keys(this.isChecked[k]).map(r => this.isChecked[k][r]).reduce((x, y) => x || y, false)) {
        this.expanded[k] = true;
      }
    });

    this.changeFilterState(name, value);
  }

  private changeFilterState(name, value, emit = true) {
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
    this.productService.applyFilters(this.current_filter_state, name, emit);
  }

  clearFilters() {
    this.current_filter_state.forEach(el => {
      el.values = [];
    });
    this.clear_box = false;

    for (const name in this.isChecked) if (this.isChecked.hasOwnProperty(name)) {
      this.expanded[name] = true;
      for (const value in this.isChecked[name]) if (this.isChecked[name].hasOwnProperty(value)) {
        this.isChecked[name][value] = false;
      }
    }

    this.sortedBy = null;
    this.sortedByChange.emit(this.sortedBy);
    this.isChecked.main = {all: true};
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
    this.side_options$.unsubscribe();
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
