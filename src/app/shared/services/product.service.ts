import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {SortOptions} from '../enum/sort.options.enum';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IFilter} from '../interfaces/ifilter.interface';

@Injectable()
export class ProductService {
  private collectionName: string;
  private products = [];
  private filteredProducts = [];
  collectionInfo$: ReplaySubject<any> = new ReplaySubject<any>(1);
  productList$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filtering$: ReplaySubject<IFilter[]> = new ReplaySubject<IFilter[]>(1);

  private filterInput: IFilter[];
  private sortInput: SortOptions;

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


    const filter: IFilter[] = [];

    if (types.length > 1) filter.push({name: 'نوع', values: types});
    if (colors.length > 1) filter.push({name: 'رنگ', values: colors});
    if (sizes.length > 1) filter.push({name: 'سایز', values: sizes});

    this.filtering$.next(filter);

  }

  loadProducts(collection_id) {
    this.httpService.get('collection/products' + collection_id).subscribe(
      (data) => {

        if (data.name) {
          this.collectionName = data.name;
          this.collectionInfo$.next(data.name);

        }
        if (data.products) {
          this.products = data.products;

          console.log('-> ', this.products);

          this.filteredProducts = this.products.slice();

          this.extractFilters();

          this.filterSortProducts();
        }
      },
      (err) => {
        console.error('Cannot get products of collection: ', err);
      }
    );
  }

  setFilter(data: IFilter[]) {

    this.filterInput = data;
    this.filterSortProducts();
  }

  setSort(data: SortOptions) {
    this.sortInput = data;
    this.filterSortProducts();
  }


  private filterSortProducts() {
    this.sortProducts();
    this.filterProducts();
    this.extractFilters();
    this.productList$.next(this.filteredProducts);
  }

  private filterProducts() {
    if (this.filterInput) {
      this.filteredProducts = [];

      this.filterInput.forEach(item => {

        switch (item.name) {
          case 'نوع' :
            this.filteredProducts = this.filteredProducts.concat(this.products.filter(product => item.values.includes(product.product_type.name)));
            break;
          case 'رنگ':
            this.filteredProducts =  this.filteredProducts.concat(this.products.filter(product => {
              const colors = [].concat.apply([], product.colors.map(color => color.name.split('/')));
              const duplicated: string[] = Array.from(new Set(colors));
              return duplicated.some(r => item.values.includes(r));
            }));
            break;
          case 'سایز':
            this.filteredProducts =  this.filteredProducts.concat(this.products.filter(product => {
              const productSizes: string[] = Array.from(new Set(product.sizes));
              return productSizes.some(r => item.values.includes(r));
            }));

            break;
        }
      });
    }
    return this.filteredProducts;
  }

  private sortProducts() {
    // if (this.sortInput) {
    //   switch (this.sortInput) {
    //     case SortOptions.newest: {
    //       return this.filteredProducts.sort(this.newestSort);
    //     }
    //     case SortOptions.lowerPrice: {
    //       return this.filteredProducts.sort((a, b) => this.priceSort(a, b, true));
    //     }
    //     case SortOptions.highestPrice: {
    //       return this.filteredProducts.sort((a, b) => this.priceSort(a, b, false));
    //     }
    //   }
    // }
    // return this.filteredProducts;
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
      return dir;
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
