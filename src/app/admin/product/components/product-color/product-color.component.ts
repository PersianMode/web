import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';

@Component({
  selector: 'app-product-color',
  templateUrl: './product-color.component.html',
  styleUrls: ['./product-color.component.css']
})
export class ProductColorComponent implements OnInit, OnChanges {


  @Input() productColors: any;
  @Output() onProductColorChanged = new EventEmitter<any>();

  selectedColor = {};
  is_thumbnail = false;
  is_disabled = false;
  thumbnailDialog;
  url = '';

  @Input() productId;

  constructor(private httpService: HttpService,
              private sanitizer: DomSanitizer, private dialog: MatDialog,
              private progressService: ProgressService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.productColors);
  }

  removeImg(color_id: string) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`/product/color/${this.productId}/${color_id}`).subscribe(
            (data) => {
              this.snackBar.open('this color deleted successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();

              this.productColors = this.productColors.filter(pc => pc._id !== color_id);

              this.onProductColorChanged.emit(this.productColors);

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

  addToTable(images: any) {
    this.is_disabled = false;
    console.log('add to table called');
    console.log(this.selectedColor);
    if (images.length > 0) {
      const pc = this.productColors.filter(x => x.color_id === this.selectedColor['color_id'])[0];
      if (pc) {
        if (!this.is_thumbnail)
          pc['image']['angles'] = pc['image']['angles'].concat(images);
        else
          pc['image']['thumbnail'] = images[images.length - 1];
      } else {
        const newProductColor = {
          image: {
            thumbnail: this.is_thumbnail ? images[images.length - 1] : '',
            angles: this.is_thumbnail ? [] : images
          },
          color_id: this.selectedColor['_id'],
          name: this.selectedColor['name'],
          _id: this.selectedColor['_id'],
        };
        console.log(newProductColor);
        this.productColors.push(newProductColor);
        this.onProductColorChanged.emit(this.productColors);
      }
    }
    this.is_thumbnail = false;
    console.log('add to table called finished');

  }

  getURL(path) {
    if (path)
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }

  setColor($event) {
    this.selectedColor = $event;
    this.url = this.selectedColor['_id'];
    this.is_thumbnail = false;
    this.is_disabled = false;
    if (this.productColors.filter(x => x.color_id === $event.color_id).length === 0) {
      this.is_thumbnail = true;
      this.is_disabled = true;

    }
  }

  edit(_id) {
    this.selectedColor = this.productColors.filter(x => x._id === _id)[0];
    this.url = this.selectedColor['color_id'];
    this.is_disabled = false;
    if (!this.selectedColor['image']['thumbnail']) {
      this.is_thumbnail = true;
      this.is_disabled = true;
    }
  }

  modalThumbnail(pc) {
    this.thumbnailDialog = this.dialog.open(ThumbnailComponent, {
      width: '800px',
      data: {
        product_color: pc
      }
    });
    this.thumbnailDialog.afterClosed().subscribe(data => {

    });
  }

  angleDelete(angle) {
    angle = angle.substring(angle.lastIndexOf('/') + 1);
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`/product/color/${this.productId}/${angle}`).subscribe(
            (data) => {
              this.snackBar.open('this angle deleted successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();

              this.onProductColorChanged.emit(this.productColors);

            },
            (error) => {
              this.snackBar.open('Cannot delete this angle. Please try again', null, {
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
