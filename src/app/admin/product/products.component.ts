import {Component, OnDestroy, OnInit} from '@angular/core';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends AbstractSearchComponent implements OnInit, OnDestroy {

  constructor(protected httpService: HttpService, protected progressService: ProgressService,
              protected router: Router, protected dialog: MatDialog,
              protected snackBar: MatSnackBar, protected sanitizer: DomSanitizer, protected titleService: TitleService) {
    super(httpService, progressService, router, dialog, snackBar, sanitizer, titleService);
  }
  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: محصولات');
    this.key = 'Product';
    super.ngOnInit();
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

/*
  getURL(path) {if (path) return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path); else return null;}
*/

  ngOnDestroy() {
  }
}
