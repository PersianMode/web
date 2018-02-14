import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';


@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  products = [
    {
      imgUrl: '../../../../assets/pictures/product-small/11.jpeg',
      name : 'کفش پیاده روی نایک',
      base_price : '155000',
    },
    {
      imgUrl: '../../../../assets/pictures/product-small/12.jpeg',
      name: 'کفش ورزشی آدیداس',
      base_price : '270000',
    },
  ];
  selectedId: string = null;
  rows: any = [];
  constructor(private httpService: HttpService,
              private router: Router) { }

  ngOnInit() {
    // TODO: should get products with calling a api
    this.searching();
  }

  searching() {
    this.alignRow();
  }

  alignRow() {
    // TODO: should get products with calling a api
    this.rows = [];
    let chunk = [], counter = 0;
    for(let c in this.products) {
      if(this.products.hasOwnProperty(c)) {
        chunk.push(this.products[c]);
        counter ++;

        if(counter >= 4) {
          counter = 0;
          this.rows.push(chunk);
          chunk = [];
        }
      }
    }
    if(counter > 0) {
      this.rows.push(chunk);
    }
  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/products/productInfo/${id}`]);
  }

  openView(id: string = null) {
    this.router.navigate([`/agent/products/${id}`]);
  }

  deleteProduct(id: string = null) {
  }

}
