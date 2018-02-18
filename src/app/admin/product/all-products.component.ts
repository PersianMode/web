import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {priceFormatter} from '../../shared/lib/priceFormatter';


@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit, OnDestroy {
  products = [];
  id: number;
  productId: string = null;
  tempArr: any = [];
  rows: any = [];

  constructor(private httpService: HttpService,
              private router: Router, private progressService: ProgressService,
              private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.products = [];
    this.rows = [];
    this.httpService.get('product').subscribe(
      (data) => {
        for (const d in data.body) {
          this.products.push({
            _id: data.body[d]._id,
            name: data.body[d].name,
            base_price: priceFormatter(data.body[d].base_price),
            product_type: data.body[d].product_type.name,
            brand: data.body[d].brand.name,
            imgUrl: '../../../../assets/pictures/product-small/11.jpeg'
          });
        }
      },
      (err) => {
        console.error('Cannot get products info. Error: ', err);
      }
    );
    this.searching();
  }
  select(item) {
    if (this.productId === item._id) {
      this.productId = null;
    } else {
      this.productId = item._id;
    }
  }

  searching() {
    this.alignRow();
  }

  alignRow() {
    this.rows.push(this.products);
  }

  openForm(id: string = null) {
    if (id)
      this.router.navigate([`/agent/products/productInfo/${id}`]);
    else
      this.router.navigate([`/agent/products/productInfo/`]);
  }

  openView(id: string = null) {
    if (id) {
      this.router.navigate([`/agent/products/${id}`]);
    }
    else
      this.router.navigate(['agent/products']);
  }

  deleteProduct(id: string = null): void {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`/product/${id}`).subscribe(
            (data) => {
              this.productId = null;
              this.snackBar.open('Product delete successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.getAllProducts();
            },
            (error) => {
              this.snackBar.open('Cannot delete this product. Please try again', null, {
                duration: 2700
              });
              this.progressService.disable();
            }
          );
        }
      },
      (err) => {
        console.log('Error in dialog: ', err);
      }
    );
  }

  ngOnDestroy() {
  }
}