import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IFilter} from '../interfaces/ifilter.interface';
import {DictionaryService} from './dictionary.service';

const productColorMap = function (r) {
  return r.colors.map(c => c.name ? c.name.split('/')
      .map(x => x.replace(/\W/g, '')) // remove all non alpha-numeric chars from color name
    : []);
};

const addHost = function (r) {
  return r.includes(HttpService.Host) ? r : HttpService.Host + r;
};

const newestSort = function (a, b) {
  if (a.year && b.year && a.season && b.season && ((a.year * 8 + a.season) - (b.year * 8 + b.season))) {
    return (a.year * 8 + a.season) - (b.year * 8 + b.season);
  } else if (a.date > b.date)
    return 1;
  else if (a.date < b.date)
    return -1;
  else {
    return 0;
  }
};

const reviewSort = function (a, b) {
  return 0;
};

const priceSort = function (a, b, lowToHigh = true) {
  const dir = lowToHigh ? 1 : -1;
  return (a.price - b.price) * dir;
};

const priceSortReverse = (a, b) => priceSort(a, b, false);

const nameSort = function (a, b) {
  if (a.name > b.name)
    return 1;
  else if (a.name < b.name)
    return -1;
  else
    return 0;
};

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

  private sortInput;
  private collectionId;

  constructor(private httpService: HttpService, private dict: DictionaryService) {
  }

  extractFilters(filters = [], trigger = '') {
    const products = trigger ? this.filteredProducts : this.products;
    let tags: any = {};

    const brand = Array.from(new Set([... products.map(r => r.brand)]));
    const type = Array.from(new Set([... products.map(r => r.product_type)]));

    const size = Array.from(new Set([...products.map(r => Object.keys(r.sizesInventory))
      .reduce((x, y) => x.concat(y), []).sort()]));
    const color = Array.from(new Set([...products.map(productColorMap)
      .reduce((x, y) => x.concat(y), []).reduce((x, y) => x.concat(y), [])]));

    let price;
    if (trigger === 'price') {
      price = [];
    } else {
      price = products.map(r => r.base_price);
      const minPrice = Math.min(...price);
      const maxPrice = Math.max(...price);
      price = [minPrice, maxPrice];
    }

    tags = {brand, type, price, size, color};

    if (trigger && trigger !== 'price') {
      tags[trigger] = this.collectionTags[trigger] ? this.collectionTags[trigger] : [];
    }

    products.forEach(p => p.tags.forEach(tag => {
      const tagGroupName = tag.tg_name;
      if (!tags[tagGroupName]) {
        tags[tagGroupName] = new Set();
      }
      tags[tagGroupName].add(tag.name);
    }));

    if (trigger) {
      this.collectionTagsAfterFilter = tags;
    } else {
      this.collectionTags = tags;
    }

    const emittedValue = [];
    for (const name in tags) {
      if (tags.hasOwnProperty(name)) {
        const values = Array.from(tags[name]);
        const found = filters.find(r => r.name === name);
        if (values.length > 1 || (found && found.values.length)) {
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

  applyFilters(filters, trigger) {
    this.filteredProducts = JSON.parse(JSON.stringify(this.products));

    filters.forEach(f => {
      if (f.values.length) {
        if (['brand', 'type'].includes(f.name)) {
          this.filteredProducts = this.filteredProducts.filter(r => Array.from(f.values).includes(r[f.name]));
        } else if (f.name === 'color') {
          this.filteredProducts
            .forEach((p, pi) => this.filteredProducts[pi].colors = p.colors
              .filter(c => Array.from(f.values).filter(v => c.name ? c.name.split('/').includes(v) : false).length));
          this.filteredProducts.forEach((p, pi) => this.enrichProductData(this.filteredProducts[pi]));
        } else if (f.name === 'size') {
          this.filteredProducts.forEach((p, pi) => this.filteredProducts[pi].instances = p.instances
            .filter(i => Array.from(f.values).includes(i.size)));
          this.filteredProducts.forEach((p, pi) => this.filteredProducts[pi].colors = p.colors
            .filter(c => p.instances.map(i => i.product_color_id).includes(c._id)));
          this.filteredProducts.forEach((p, pi) => this.enrichProductData(this.filteredProducts[pi]));
        } else if (f.name === 'price') {
          this.filteredProducts = this.filteredProducts.filter(p => p.base_price >= f.values[0] && p.base_price <= f.values[1]);
        } else {
          this.filteredProducts = this.filteredProducts
            .filter(p => p.tags.filter(t => Array.from(f.values).includes(t.name)).length);
        }
      }

      this.filteredProducts = this.cleanProductsList(this.filteredProducts);
    });
    this.sortProductsAndEmit();
    this.extractFilters(filters, trigger);
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

  private cleanProductsList(data: any[]) {
    return data.filter(p => p.instances.length && p.colors.length);
  }

  private enrichProductData(data) {
    data.id = data._id;
    data.type = data.product_type;
    data.price = data.base_price;
    const year = data.tags.find(r => r.tg_name === 'Season Year');
    const season = data.tags.find(r => r.tg_name === 'Season');
    data.year = year ? +year.name : NaN;
    data.season = season ? ['HOLI', 'CORE', 'WINTER', 'SPRING', 'SUMMER', 'FALL'].indexOf(season.name) : NaN;
    data.sizesByColor = {};
    data.sizesInventory = {};
    data.colors.forEach(item => {
      const angles = [];
      item.image.angles.forEach(r => {
        if (!r.url) {
          const temp = {url: addHost(r), type: r.split('.').pop(-1) === 'webm' ? 'video' : 'photo'};
          angles.push(temp);
        } else {
          angles.push(r);
        }
      });
      item.image.angles = angles;
      if (item.image.thumbnail) {
        item.image.thumbnail = addHost(item.image.thumbnail);
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
            const inventory = r.inventory.map(e => e.count ? e.count : 0).reduce((x, y) => x + y, 0);
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
    this.sortInput = null;
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

            this.sortProductsAndEmit();
            this.extractFilters();
          }
        },
        (err) => {
          console.error('Cannot get products of collection: ', err);
        }
      );
  }

  setSort(sortInput) {
    if (this.sortInput !== sortInput) {
      this.sortInput = sortInput;
      this.sortProductsAndEmit();
    }
  }

  private sortProductsAndEmit() {
    let sortedProducts = [];
    switch (this.sortInput) {
      case 'newest': {
        sortedProducts = this.filteredProducts.slice().sort(newestSort);
        break;
      }
      case 'highest': {
        sortedProducts = this.filteredProducts.slice().sort(reviewSort);
        break;
      }
      case 'cheapest': {
        sortedProducts = this.filteredProducts.slice().sort(priceSort);
        break;
      }
      case 'most': {
        sortedProducts = this.filteredProducts.slice().sort(priceSortReverse);
        break;
      }
      case 'alphabetical': {
        sortedProducts = this.filteredProducts.slice().sort(nameSort);
        break;
      }
      default: {
        sortedProducts = this.filteredProducts;
      }
    }
    this.productList$.next(sortedProducts);
  }
}
