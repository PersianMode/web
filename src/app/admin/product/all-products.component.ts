import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {priceFormatter} from '../../shared/lib/priceFormatter';
import {DomSanitizer} from '@angular/platform-browser';
import {AbstractSearchComponent} from "../../shared/components/abstract-search/abstract-search.component";


@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent extends AbstractSearchComponent implements OnInit, OnDestroy {

  // tempUrl = '';
  // noPic;

  ngOnInit() {
    this.key = 'Product';
    super.ngOnInit();
  }

  // getAllProducts() {
  //   this.products = [];
  //   this.rows = [];
  //   this.httpService.get('product').subscribe(
  //     (data) => {
  //       for (const d in data.body) {
  //         this.tempUrl = data.body[d].colors.length ? data.body[d].colors[0].images[0] : '../../../../assets/pictures/product-small/11.jpeg';
  //         this.noPic = data.body[d].colors.length ? false : true;
  //         this.products.push({
  //           _id: data.body[d]._id,
  //           name: data.body[d].name,
  //           base_price: priceFormatter(data.body[d].base_price),
  //           product_type: data.body[d].product_type.name,
  //           brand: data.body[d].brand.name,
  //           imgUrl: this.tempUrl,
  //           imgDefaultPic: this.noPic,
  //         });
  //       }
  //     },
  //     (err) => {
  //       console.error('Cannot get products info. Error: ', err);
  //     }
  //   );
  //   this.searching();
  // }

  openForm(id: string = null) {
    if (id)
      this.router.navigate([`/agent/products/productInfo/${id}`]);
    else
      this.router.navigate([`/agent/products/productInfo/`]);
  }

  openView(id: string = null) {
    if (id) {
      this.router.navigate([`/agent/products/${id}`]);
    } else {
      this.router.navigate(['agent/products']);
    }
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
              this.snackBar.open('Product deleted successfully', null, {
                duration: 2000,
              });
              this.searching();
              this.progressService.disable();
            },
            (error) => {
              this.snackBar.open('Cannot delete this product. Please try again', null, {
                duration: 2700
              });
              this.progressService.disable();
            });
        }
      },
      (err) => {
        console.log('Error in dialog: ', err);
      });
  }

  getURL(path) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }

  ngOnDestroy() {
  }
}
