import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';

export interface CollectionProducts {
  name: string;
};

export interface Products {
  id: number;
  name: string;
  image_url: {
    url: string,
    alt: string
  };
  products: CollectionProducts[];
}

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  products: Products[] = [];
  selectedId: string = null;
  rows: any = [];
  constructor(private httpService: HttpService,
              private router: Router) { }

  ngOnInit() {
    this.searching();
  }

  searching() {
    // this.authService.getAllCollections().subscribe(
    this.httpService.getMockProducts().subscribe(
      (data) => {
        console.log('*/*/*/*', data);
        // data = data.body.collections;
        // for (let d in data) {
        //   let col = {
        //     id: data[d].id,
        //     name: data[d].name,
        //     image_url: {
        //       url: data[d].image_url.url,
        //       alt: data[d].image_url.alt
        //     },
        //     products: [],
        //   };
        //   col['products'] = [];
        //   for (let p in data[d].products) {
        //     col['products'].push({
        //       name: data[d].products[p].name
        //     });
        //   }
        //   this.products.push(col);
        // }
        // // console.log(this.products);
        // this.alignRow();
      }
    );
  }

  alignRow() {
    // TODO: should be multiple per row not all in one row - after paginator added
    this.rows.push(this.products);
  }

  openForm(id: string = null) {
    this.router.navigate([`/admin/products/productForm/${id}`]);
  }

  openView(id: string = null) {
    this.router.navigate([`/admin/products/${id}`]);
  }

  deleteCollection(id: string = null) {
  }

}
