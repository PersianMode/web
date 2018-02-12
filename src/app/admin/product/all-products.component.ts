import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';


@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  products = [];
  id: number;
  selectedId: string = null;
  rows: any = [];

  constructor(private httpService: HttpService,
              private router: Router) {
  }

  ngOnInit() {
    // TODO: should get products with calling a api
    this.httpService.get('product').subscribe(
      (data) => {
        console.log('===>', data.body);
        for (const d in data.body) {
          this.products.push({
            _id: data.body[d]._id,
            name: data.body[d].name,
            // 'desc' : data.body[i].desc,
            base_price: data.body[d].base_price,
            product_type: data.body[d].product_type.name,
            brand: data.body[d].brand.name,
            imgUrl: '../../../../assets/pictures/product-small/11.jpeg'
          });
        }
      }
    );
    this.searching();
  }

  select(item) {
    console.log('===>', item);
    if (this.selectedId === item._id) {
      this.selectedId = null;
    } else {
      this.selectedId = item._id;
    }
    console.log('===>', this.selectedId);
  }

  searching() {
    this.alignRow();
  }

  // alignRow() {
  //   // TODO: should be multiple per row not all in one row - after paginator added
  //   // TODO: should get products with calling a api
  //   for ( let p in this.products ){
  //     this.rows.push(this.products[p]);
  //   }
  //   console.log('***', this.rows);
  // }

  alignRow() {
    this.rows.push(this.products);
  }

  openForm(id: string = null) {
    console.log(id);
    this.router.navigate([`/agent/products/productInfo/${id}`]);
  }
  openView(id: string = null) {
    this.router.navigate([`/agent/products/${id}`]);
  }

  deleteProduct(id: string = null) {
  }
}