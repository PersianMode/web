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
    // TODO: should be multiple per row not all in one row - after paginator added
    // TODO: should get products with calling a api
    this.rows.push(this.products);
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
