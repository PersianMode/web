import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IFilter} from '../interfaces/ifilter.interface';
import {HttpClient} from '@angular/common/http';
import {DictionaryService} from './dictionary.service';

@Injectable()
export class ProductService {
  private collectionName: string;
  private products = [];
  private filteredProducts = [];
  collectionNameFa$: ReplaySubject<any> = new ReplaySubject<any>(1);
  productList$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filtering$: ReplaySubject<IFilter[]> = new ReplaySubject<IFilter[]>(1);
  product$: ReplaySubject<any> = new ReplaySubject<any>();
  collectionTags: any = {};
  collectionTagsAfterFilter: any = {};

  private filterInput: IFilter[];
  private sortInput = '';
  private collectionId;

  constructor(private httpService: HttpService, private http: HttpClient, private dict: DictionaryService) {
  }

  extractFilters(trigger = '') {
    let products = this.products, tags = this.collectionTags;
    if (trigger) {
      products = this.filteredProducts;
      tags = this.collectionTagsAfterFilter;
    }
    const brand = Array.from(new Set([... products.map(r => r.brand)]));
    const type = Array.from(new Set([... products.map(r => r.product_type)]));
    let price = [4e3, 446e3, 2e3, 354e2, 999e3, 9e5, 3e6]; // products.map(r => r.base_price);
    const minPrice = Math.min(...price);
    const maxPrice = Math.max(...price);
    price = [minPrice, maxPrice];
    const size = Array.from(new Set(...products.map(r => Object.keys(r.sizesInventory)).reduce((x, y) => x.concat(y), []).sort()));
    const color = Array.from(new Set(...products.map(r => r.color
      .map(c => c.name ? c.name.split('/') : [])
      .reduce((x, y) => x.concat(y), []))));

    tags = {brand, type, price, size, color};

    if (trigger) {
      tags[trigger] = this.collectionTags[trigger] ? this.collectionTags[trigger] : [];
    }

    products.forEach(p => p.tags.forEach(tag => {
      const tagGroupName = tag.tg_name;
      if (!tags[tagGroupName]) {
        tags[tagGroupName] = new Set();
      }
      tags[tagGroupName].add(tag.name);
    }));

    const emittedValue = [];
    for (const name in tags) {
      if (tags.hasOwnProperty(name)) {
        const values = Array.from(tags[name]);
        if (values.length > 1) {
          emittedValue.push({
            name: name,
            name_fa: this.dict.translateWord(name),
            values,
            values_fa: values.map((r: string | number) => name !== 'color' ? this.dict.translateWord(r) : this.dict.convertColor(r + ''))
          });
        }
      }
    }
    this.filtering$.next(emittedValue);
  }

  emptyFilters() {
    this.filtering$.next([]);
  }

  getProduct(productId) {
    const found = this.products.findIndex(r => r._id === productId);
    if (found >= 0 && this.products[found].detailed) {
      this.product$.next(this.products[found]);
    } else {
      this.httpService.get(`product/${productId}`).subscribe(data => {
        this.enrichProductData(data);
        if (found >= 0) {
          this.products[found] = data;
        }
        this.product$.next(data);
      });
    }
  }

  private enrichProductData(data) {
    data.id = data._id;
    data.price = data.base_price;
    data.sizesByColor = {};
    data.sizesInventory = {};
    data.colors.forEach(item => {
      const angles = [];
      item.image.angles.forEach(r => {
        if (!r.url) {
          const temp = {url: HttpService.Host + r, type: r.split('.').pop(-1) === 'webm' ? 'video' : 'photo'};
          angles.push(temp);
        } else {
          angles.push(r);
        }
      });
      item.image.angles = angles;
      if (item.image.thumbnail) {
        item.image.thumbnail = HttpService.Host + item.image.thumbnail;
      }
      if (data.instances) {
        data.detailed = true;
        item.soldOut = data.instances
          .filter(r => r.product_color_id === item._id)
          .map(r => r.inventory)
          .map(r => r.map(e => e.count ? e.count : 0).reduce((x, y) => x + y, 0))
          .reduce((x, y) => x + y, 0) <= 0;

        data.sizesByColor[item._id] = data.instances
          .filter(r => r.product_color_id === item._id)
          .map(r => {
            const inventory = r.inventory.reduce((x, y) => x.count + y.count, 0);
            if (inventory) {
              if (!data.sizesInventory[r.size]) {
                data.sizesInventory[r.size] = {};
              }
              data.sizesInventory[r.size][item._id] = inventory;
            }
            return {
              value: r.size,
              disabled: inventory <= 0,
            };
          });
      } else {
        data.detailed = false;
      }
    });
  }

  loadProducts(collection_id) {
    this.httpService.get('collection/product/' + collection_id)
      .subscribe(
        (data) => {
          if (data.name_fa) {
            this.collectionName = data.name_fa;
            this.collectionNameFa$.next(data.name_fa);

          }
          if (data.products) {
            for (const product of data.products) {
              this.enrichProductData(product);
            }
            this.collectionId = collection_id;
            this.products = data.products;
            this.filteredProducts = this.products.slice();

            this.extractFilters();
            this.productList$.next(this.filteredProducts);
            // this.filterSortProducts();
          }
        },
        (err) => {
          console.error('Cannot get products of collection: ', err);
        }
      );
  }

  setFilter(name, value) {

  }

  setSort(data) {
    this.sortInput = data;
    this.filterSortProducts();
  }


  private filterSortProducts() {
    this.filterProducts();
    this.sortProducts();
    this.extractFilters();

  }

  private filterProducts() {
    if (this.filterInput) {
      this.filteredProducts = [];
      this.filterInput.forEach(item => {

        switch (item.name) {
          case 'نوع' :
            this.filteredProducts = this.filteredProducts
              .concat(this.products.filter(product => item.values.includes(product.product_type.name)));
            break;
          case 'رنگ':
            this.filteredProducts = this.filteredProducts.concat(this.products.filter(product => {
              const colors = [].concat.apply([], product.colors.map(color => color.name.split('/')));
              const duplicated: string[] = Array.from(new Set(colors));
              return duplicated.some(r => item.values.includes(r));
            }));
            break;
          case 'سایز':
            this.filteredProducts = this.filteredProducts.concat(this.products.filter(product => {
              const productSizes: string[] = Array.from(new Set(product.sizes));
              return productSizes.some(r => item.values.includes(r));
            }));

            break;
        }
      });
    }
  }

  private sortProducts() {
    if (this.sortInput) {
      switch (this.sortInput) {
        case 'newest': {
          return this.filteredProducts.sort(this.newestSort);
        }
        case 'highest': {
          return this.filteredProducts.sort((a, b) => this.reviewSort(a, b));
        }
        case 'cheapest': {
          return this.filteredProducts.sort((a, b) => this.priceSort(a, b, true));
        }
        case 'most': {
          return this.filteredProducts.sort((a, b) => this.priceSort(a, b, false));
        }
      }
    }
    return this.filteredProducts;
  }

  private newestSort(a, b) {
    if (a.date > b.date)
      return 1;
    else if (a.date < b.date)
      return -1;
    else
      return this.nameSort(a, b);
  }

  private reviewSort(a, b) {
    return 0;
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
