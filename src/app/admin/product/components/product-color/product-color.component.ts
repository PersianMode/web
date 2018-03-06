import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IColor} from '../../interfaces/icolor';
import {IProductColor} from '../../interfaces/iproduct-color';
import {HttpService} from '../../../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';

@Component({
  selector: 'app-product-color',
  templateUrl: './product-color.component.html',
  styleUrls: ['./product-color.component.css']
})
export class ProductColorComponent implements OnInit {

  productColorForm: FormGroup;


  @Input() productColors: IProductColor[];
  @Output() onProductColorChanged = new EventEmitter<IProductColor[]>();
  @Input() colors: IColor[];

  selectedColorId: string = null;
  is_thumbnail: false;

  @Input() productId;

  constructor(private httpService: HttpService,
              private sanitizer: DomSanitizer, private dialog: MatDialog,
              private progressService: ProgressService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.productColorForm = new FormBuilder().group({
        proColor: [null, [
          Validators.required,
        ]],
        isThumbnail: [null, [
          Validators.required,
        ]]
      },
    );
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
              this.snackBar.open('Product OnCompleted for this color deleted successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();

              this.productColors = this.productColors.filter(pc => pc.info._id !== color_id);

              this.onProductColorChanged.emit(this.productColors);

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

  addToTable(images: any, ) {
    const pc = this.productColors.filter(x => x.info._id === this.selectedColorId)[0];

    if (pc) {
      pc.images = pc.images.concat(images);
    } else {
      const newProductColor: IProductColor = {
        images: images,
        info: this.colors.filter(x => x._id === this.selectedColorId)[0],
        _id: null
      };
      this.productColors.push(newProductColor);
      this.onProductColorChanged.emit(this.productColors);
    }
  }

  getURL(path) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }
}
