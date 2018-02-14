import {Component, OnInit} from '@angular/core';
import {AbstractSearchComponent} from "../../shared/components/abstract-search/abstract-search.component";


@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent extends AbstractSearchComponent implements OnInit {

  ngOnInit() {
    this.key = 'product';
    this.viewName = 'Product';
    super.ngOnInit();
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
