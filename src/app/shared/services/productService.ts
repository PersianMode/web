import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SortOptions} from '../enum/sort.options.enum';

@Injectable()
export class ProductService {
  // Products array has mock data
  products = [
    {
      name: 'جوردن ایر مدل ‍۱۰ رترو',
      colors: [
        {
          url: 'assets/product-pic/06.jpg',
          position: 0,
        },
      ],
      tags: ['کفش', 'مردانه', 'بسکتبال'],
      base_price: 499900,
    },
    {
      name: 'کایری ۳ مدل What The',
      colors: [
        {
          url: 'assets/product-pic/14.jpeg',
          position: 0,
          pi_id: 14,
        },
      ],
      tags: ['کفش', 'بسکتبال', 'نوجوانان'],
      base_price: 599000,
    },
    {
      name: 'له‌برون مدل 15 BHM',
      colors: [
        {
          url: 'assets/product-pic/01.jpg',
          position: 0,
        },
      ],
      tags: ['کفش', 'مردانه', 'بسکتبال'],
      base_price: 1499900,
    },
    {
      name: 'نایک ایر مدل Huarache Drift',
      colors: [
        {
          url: 'assets/product-pic/02.jpg',
          position: 0,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/02.jpg',
          position: 1,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/02.jpg',
          position: 2,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/11.jpeg',
          position: 0,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/12.jpeg',
          position: 0,
          pi_id: 0,
        },
      ],
      tags: ['کفش', 'مردانه'],
      base_price: 1499900,
    },
    {
      name: 'نایک ایر',
      colors: [
        {
          url: 'assets/product-pic/03.jpg',
          position: 0,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/03.jpg',
          position: 1,
          pi_id: 1,
        },
      ],
      tags: ['تاپ', 'نیم‌زیپ', 'مردانه'],
      base_price: 499900,
    },
    {
      name: 'نایک ایر فورس ۱ مدل Premium \'07',
      colors: [
        {
          url: 'assets/product-pic/04.jpg',
          position: 0,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/04.jpg',
          position: 1,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/04.jpg',
          position: 2,
          pi_id: 0,
        },
      ],
      tags: ['کفش', 'مردانه', 'بسکتبال'],
      base_price: 1099900,
    },
    {
      name: 'کایری 4',
      colors: [
        {
          url: 'assets/product-pic/05.jpg',
          position: 0,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/05.jpg',
          position: 1,
          pi_id: 0,
        },
      ],
      tags: ['کفش', 'مردانه', 'بسکتبال'],
      base_price: 799900,
    },
    {
      name: 'نایک Sportswear',
      colors: [
        {
          url: 'assets/product-pic/07.jpg',
          position: 0,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/07.jpg',
          position: 1,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/07.jpg',
          position: 2,
          pi_id: 0,
        },
      ],
      tags: ['جکت', 'مردانه'],
      base_price: 899900,
    },
    {
      name: 'نایک Sportswear Tech Shield',
      colors: [
        {
          url: 'assets/product-pic/08.jpg',
          position: 0,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/08.jpg',
          position: 1,
          pi_id: 0,
        },
        {
          url: 'assets/product-pic/08.jpg',
          position: 2,
          pi_id: 0,
        },
      ],
      tags: ['جکت', 'مردانه'],
      base_price: 1399900,
    },
    {
      name: 'نایک مدل Kobe A.D. Black Mamba',
      colors: [
        {
          url: 'assets/product-pic/13.jpeg',
          position: 0,
          pi_id: 0,
        },
      ],
      tags: ['کفش', 'مردانه', 'بسکتبال'],
      base_price: 999900,
    },
  ];
  productList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filtering$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  sortOptions = SortOptions;
  filterData = {};
  sortData = null;

  constructor(private httpService: HttpService) {
  }

  extractFilters() {

  }

  loadProducts(collection_id) {
    this.httpService.get('collection/' + collection_id).subscribe(
      (data) => {
        this.products = data[0].products;

        this.extractFilters();

        this.filterSortProducts();
      },
      (err) => {
        console.error('Cannot get products of collection: ', err);
      }
    );
  }

  getProducts(startIndex, boundSize = 10) {
    const tempProducts = this.filterSortProducts(true);
    if (tempProducts && tempProducts.length > 0 && tempProducts.length > startIndex)
      this.productList$.next(tempProducts.slice(0, startIndex + boundSize));
  }

  filterSortProducts(returnData = false) {
    const newData = this.sortProducts(this.sortData, this.filterProducts(this.filterData));

    if (returnData)
      return newData;
    this.productList$.next(newData);
  }

  private filterProducts(options) {
    // Mock code
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
