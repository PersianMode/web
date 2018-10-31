import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-collection-product',
  templateUrl: './collection-product.component.html',
  styleUrls: ['./collection-product.component.css']
})
export class CollectionProductComponent implements OnInit {
  products: any[];
  @Input() collectionId: string;

  constructor(private router: Router, private httpService: HttpService, private progressService: ProgressService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {

    this.progressService.enable();
    this.httpService.get(`collection/product/manual/${this.collectionId}`).subscribe(res => {

      if (res && res.products)
        this.products = res.products;
      this.progressService.disable();
    }, err => {
      this.snackBar.open('Couldn\'t get collection products.', null, {
        duration: 3200
      });
      this.progressService.disable();
    });
  }

  addProduct(expObj) {
    this.progressService.enable();

    this.httpService.post(`collection/product/${this.collectionId}`, {productId: expObj._id}).subscribe(
      data => {

        this.snackBar.open('product added to collection successfully.', null, {
          duration: 3200
        });
        this.products.push(Object.assign(expObj, {
          brand: data.brand.name,
          product_type: data.product_type.name,
        }));
        this.progressService.disable();

      }, err => {
        this.snackBar.open('couldn\'t add product to collection.', null, {
          duration: 3200
        });
        this.progressService.disable();

      }
    );
  }

  viewProduct(pid) {
    this.router.navigate([`/agent/products/productInfo/${pid}`]);
  }

  removeProduct(pid) {
    this.httpService.delete(`collection/product/${this.collectionId}/${pid}`).subscribe(
      (data) => {
        this.products = this.products.filter(x => x._id !== pid);
        this.progressService.disable();
        this.snackBar.open('product removed from collection.', null, {
          duration: 3200
        });

      }, err => {
        this.snackBar.open('couldn\'t remove product from collection.', null, {
          duration: 3200
        });
        this.progressService.disable();
      }
    );
  }


}
