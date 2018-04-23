import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {MatDialog, MatSnackBar, MatDialogRef} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {ProductColorEditComponent} from '../product-color-edit/product-color-edit.component';

@Component({
  selector: 'app-product-color',
  templateUrl: './product-color.component.html',
  styleUrls: ['./product-color.component.css']
})
export class ProductColorComponent implements OnInit, OnChanges {


  colorEditDialog: MatDialogRef<ProductColorEditComponent, any>;
  @Input() product;

  constructor(private httpService: HttpService,
    private sanitizer: DomSanitizer, private dialog: MatDialog,
    private progressService: ProgressService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  openColorEditDialog(pc: any) {
    this.colorEditDialog = this.dialog.open(ProductColorEditComponent, {
      width: '800px',
      height: '640px',
      data: {
        productId: this.product._id,
        product_color: pc
      }
    });
  }

  removeProductColor(pc: any) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`/product/color/${this.product._id}/${pc.color_id}`).subscribe(
            (data) => {
              this.snackBar.open('this color deleted successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();

              this.product.colors = this.product.colors.filter(x => x._id !== pc._id);

              // this.onProductColorChanged.emit(this.product.colors);

            },
            (error) => {
              this.snackBar.open('Cannot delete this color. Please try again', null, {
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

  getURL(name, pc) {
    if (name) {
      const path = HttpService.PRODUCT_IMAGE_PATH + this.product._id + '/' + pc.color_id + '/' + name;
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
    } else
      return '';
  }


}
