import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';


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
              private router: Router, private progressService: ProgressService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }
  ngOnInit() {
    this.getAllProducts();
  }
  getAllProducts() {
    this.products = [];
    this.rows = [];
    this.httpService.get('product').subscribe(
      (data) => {
        console.log('=>', data.body);
        for (const d in data.body) {
          this.products.push({
            _id: data.body[d]._id,
            name: data.body[d].name,
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
    if (this.selectedId === item._id) {
      this.selectedId = null;
    } else {
      this.selectedId = item._id;
    }
  }

  searching() {
    this.alignRow();
  }

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
              this.selectedId = null;
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
}