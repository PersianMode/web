import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {SortOptions} from '../enum/sort.options.enum';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IFilter} from '../interfaces/ifilter.interface';
import {ISort} from '../interfaces/isort.interface';

@Injectable()
export class ProductService {
  // Products array has mock data
  private products = [];
  private filteredProducts = [];
  productList$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filtering$: ReplaySubject<IFilter[]> = new ReplaySubject<IFilter[]>(1);

  private sortOptions = SortOptions;
  private filterInput: IFilter[];
  private sortInput: ISort;

  constructor(private httpService: HttpService) {
  }

  extractFilters() {


    const types: string[] = Array.from(new Set(this.filteredProducts.map(x => x['product_type'].name)));

    let colors: string[] = [];
    let _colors: string[] = this.filteredProducts.map(x => x['colors']);
    _colors = [].concat.apply([], _colors).map(x => x.name);
    _colors.forEach(c => c.split('/').map(x => x.trim()).forEach(x => colors.push(x)));
    colors = Array.from(new Set(colors));

    let sizes: string[] = this.filteredProducts.map(x => x['size']);
    sizes = Array.from(new Set([].concat.apply([], sizes)));

    const prices: string[] = Array.from(new Set((this.filteredProducts.map(x => x['base_price']))));

    const filter: IFilter[] = [];

    if (types.length > 1) filter.push({name: 'نوع', values: types});
    if (colors.length > 1) filter.push({name: 'رنگ', values: colors});
    if (sizes.length > 1) filter.push({name: 'سایز', values: sizes});
    if (prices.length > 1) filter.push({name: 'قیمت', values: prices});

    this.filtering$.next(filter);

  }

  loadProducts(collection_id) {
    this.httpService.get('collection/' + collection_id).subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = this.products.slice();

        this.extractFilters();

        this.filterSortProducts();
      },
      (err) => {
        console.error('Cannot get products of collection: ', err);
      }
    );
  }

  getProducts(startIndex, boundSize = 10) {

    if (this.filteredProducts && this.filteredProducts.length > 0 && this.filteredProducts.length > startIndex)
      this.productList$.next(this.filteredProducts.slice(0, startIndex + boundSize));
  }

  setFilter(data: IFilter[]) {

    this.filterInput = data;
    this.filteredProducts = [];
    this.filterInput.forEach(item => {

      switch (item.name) {
        case 'نوع' :
          this.filteredProducts.concat(this.products.filter(product => item.values.includes(product.product_type.name)));
          break;
        case 'رنگ':
          this.filteredProducts.concat(this.products.filter(product => {
            const colors = [].concat.apply([] , product.colors.map(color => color.name.split('/')));
            const duplicated: string[] = Array.from(new Set(colors));
            return duplicated.some(r => item.values.includes(r));
          }));
          break;
        case 'سایز':
          this.filteredProducts.concat(this.products.filter(product => {
            const productSizes: string[] = Array.from(new Set(product.sizes));
            return productSizes.some(r => item.values.includes(r));
          }));

          break;
        case 'قیمت':
          this.filteredProducts.concat(this.products.filter(product =>  product.base_price >= item.values[0] && product.base_price < item.values[1]));
          break;
      }
    });


    this.productList$.next(this.filteredProducts);
    this.extractFilters();
  }

  setSort(data: ISort) {
    this.sortInput = data;
  }


  private filterSortProducts() {
    this.filteredProducts = this.sortProducts(this.sortInput, this.filterProducts(this.filterInput));
    this.extractFilters();

    this.productList$.next(this.filteredProducts);
  }

  private filterProducts(options: IFilter[]) {


    return this.products;
  }

  private sortProducts(option, data) {
    switch (option) {
      case this.sortOptions.newest: {
        return data.sort(this.newestSort);
      }
      case this.sortOptions.lowerPrice: {
        return data.sort((a, b) => this.priceSort(a, b, true));
      }
      case this.sortOptions.highestPrice: {
        return data.sort((a, b) => this.priceSort(a, b, false));
      }
      default: {
        return this.products;
      }
    }
  }

  private newestSort(a, b) {
    if (a.date > b.date)
      return 1;
    else if (a.date < b.date)
      return -1;
    else
      return this.nameSort(a, b);
  }

  private priceSort(a, b, lowToHigh = true) {
    const dir = lowToHigh ? 1 : -1;
    if (a.base_price < b.base_price)
      return dir * 1;
    else if (a.base_price > b.base_price)
      return dir * -1;
    else
      return this.nameSort(a, b);
  }

  private nameSort(a, b) {
    if (a.name > b.name)
      return 1;
    else if (a.name < b.name)
      return -1;
    else
      return 0;
  }
}
