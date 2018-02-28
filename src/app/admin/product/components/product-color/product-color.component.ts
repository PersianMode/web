import {Component, Input, OnInit} from '@angular/core';
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
  colors: IColor[] = [
    {
      _id: '5a969ca83b2e51157c355e72',
      name: 'قرمز',
      color_id: '101'
    },
    {
      _id: '5a969cd33b2e51157c355e73',
      name: 'سبز',
      color_id: '102'
    },
    {
      _id: '5a969d0c3b2e51157c355e75',
      name: 'صورتی',
      color_id: '103'
    },
    {
      _id: '5a969d2d3b2e51157c355e76',
      name: 'بنفش',
      color_id: '104'
    }];

  productColors: IProductColor[] = [];
  selectedColorId: string = null;

  @Input () productId;
  constructor(private httpService: HttpService,
              private sanitizer: DomSanitizer, private dialog: MatDialog,
              private progressService: ProgressService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.initForm();
    this.getProductColors();
  }

  initForm() {
    this.productColorForm = new FormBuilder().group({
        proColor: [null, [
          Validators.required,
        ]],
      },
    );
  }

  getProductColors() {
    this.httpService.get(`product/color/${this.productId}`).subscribe(res => {
      this.productColors = [];
      res.colors.forEach(color => {
        this.productColors.push(color);
      });
    }, err => {
      console.error();
    });
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
              this.snackBar.open('Product images for this color deleted successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.getProductColors();
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

  addToTable(images: any) {
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
    }
  }

  getURL(path) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }
}
