import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit, OnDestroy {
  product: any = [];
  productId: string = null;
  productColors: any = [];
  colorLength: string = '';

  constructor(private snackBar: MatSnackBar,
              public dialog: MatDialog, private progressService: ProgressService,
              private route: ActivatedRoute,
              private router: Router, private httpService: HttpService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.productId = params['id'] ? params['id'] : null;
        if (this.productId) {
          this.progressService.enable();

          this.httpService.get(`/product/${this.productId}`).subscribe(
            (data) => {
              this.product.push(data.body[0]);
              this.product[0].base_price = priceFormatter(this.product[0].base_price);
              this.progressService.disable();
            },
            (err) => {
              this.progressService.disable();
              console.error('Cannot get product info. Error: ', err);
            }
          );
        }
      });
    this.getProductColors();
  }

  getURL(path) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }

  getProductColors() {
    this.httpService.get(`product/color/${this.productId}`).subscribe(
      (data) => {
        for (let i = 0; i < data.body.colors.length; i++) {
          this.productColors.push(data.body.colors[i].info.name);
        }
        this.colorLength = priceFormatter(data.body.colors.length);
      },
      (err) => {
        console.error('Cannot get product info. Error: ', err);
      }
    );

  }

  openForm(id: string = null) {
    if (id)
      this.router.navigate([`/agent/products/productInfo/${id}`]);
    else
      this.router.navigate([`/agent/products/productInfo/`]);
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
              this.snackBar.open('Product delete successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.productId = null;
              this.router.navigate(['agent/products']);
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
    this.productId = null;
    this.product = null;
  }
}
