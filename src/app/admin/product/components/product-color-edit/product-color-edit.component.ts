import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {HttpService} from 'app/shared/services/http.service';
import {ProgressService} from 'app/shared/services/progress.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-product-color-edit',
  templateUrl: './product-color-edit.component.html',
  styleUrls: ['./product-color-edit.component.css']
})
export class ProductColorEditComponent implements OnInit {

  thumbnailURL: any;
  constructor(private dialogRef: MatDialogRef<ProductColorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService,
    private progressService: ProgressService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar) {

  }

  ngOnInit() {

    if (this.data.product_color.image && this.data.product_color.image.thumbnail)
      this.thumbnailURL = this.getURL(this.data.product_color.image.thumbnail);

  }

  setThumbnail(result: any) {
    this.data.product_color.image.thumbnail = result[0];
    this.thumbnailURL = this.getURL(this.data.product_color.image.thumbnail);
  }

  addAngle(result: any) {
    this.data.product_color.image.angles = this.data.product_color.image.angles.concat(result);
  }

  removeAngle(angle) {
    this.httpService.post(`product/image/${this.data.productId}/${this.data.product_color._id}`, {
      angle
    }).subscribe(res => {

      if (res.n === 1) {
        const index = this.data.product_color.image.angles.findIndex(x => x === angle);
        if (index >= 0) {
          this.data.product_color.image.angles.splice(index, 1);
        }
      } else {
        this.openSnackBar('خطا در حذف تصویر');
      }

    }, err => {
      this.openSnackBar('خطا در حذف تصویر');
    });
  }

  getURL(name) {
    if (name) {
      const path = [HttpService.Host,
      HttpService.PRODUCT_IMAGE_PATH,
      this.data.productId,
      this.data.product_color._id,
        name].join('/');
      return this.sanitizer.bypassSecurityTrustResourceUrl(path);
    } else
      return '';
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }


}
