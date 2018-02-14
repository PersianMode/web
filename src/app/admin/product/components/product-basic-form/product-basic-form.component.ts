import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-product-basic-form',
  templateUrl: './product-basic-form.component.html',
  styleUrls: ['./product-basic-form.component.css']
})
export class ProductBasicFormComponent implements OnInit, OnDestroy {
  productBasicForm: FormGroup;
  types = [
    {text: 'عینک', value: '5a813ae66760822bb8329a2b'},
    {text: 'تی شرت', value: '5a813ad56760822bb8329a2a'},
    {text: 'شلوار', value: '5a813ac86760822bb8329a29'},
    {text: 'کفش', value: '5a813b066760822bb8329a2c'},
  ];
  brands = [
    {text: 'نایک', value: '5a8138696760822bb8329a25'},
    {text: 'آدیداس', value: '5a81387d6760822bb8329a26'},
    {text: 'پلیس', value: '5a8138a56760822bb8329a28'},
    {text: 'گپ', value: '5a81388d6760822bb8329a27'},
  ];
  upsertBtnShouldDisabled = false;
  deleteBtnShouldDisabled = false;
  productId: string = null;
  anyChanges = false;
  product: any = {};
  loadedValue: any = {};

  constructor(private httpService: HttpService, private snackBar: MatSnackBar,
              private route: ActivatedRoute, private router: Router,
              public dialog: MatDialog, private progressService: ProgressService) {
  }

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe(
      (params) => {
        this.productId = params['id'];
        if (this.productId) {
          this.progressService.enable();
          this.httpService.get(`/product/${this.productId}`).subscribe(
            (data) => {
              this.product = data.body[0];
              this.loadedValue = data.body[0];
              this.progressService.disable();
              this.initForm();
            },
            (err) => {
              this.progressService.disable();
              console.error('Cannot get product info... Error: ', err);
            }
          );
        }
        else {
          this.productId = null;
        }
      });
  }

  initForm() {
    this.productBasicForm = new FormBuilder().group({
        name: [(Object.keys(this.loadedValue).length && this.loadedValue.name) ? this.loadedValue.name : null, [
          Validators.required,
        ]],
        base_price: [(Object.keys(this.loadedValue).length && this.loadedValue.base_price) ? this.loadedValue.base_price : null, [
          Validators.required,
        ]],
        product_type: [(Object.keys(this.loadedValue).length && this.loadedValue.product_type._id) ? this.loadedValue.product_type._id : null, [
          Validators.required,
        ]],
        brand: [(Object.keys(this.loadedValue).length && this.loadedValue.brand._id) ? this.loadedValue.brand._id : null, [
          Validators.required,
        ]],
        desc: [(Object.keys(this.loadedValue).length && this.loadedValue.desc) ? this.loadedValue.desc : null, [
          Validators.maxLength(50),
        ]]
      },
      {
        validator: this.basicInfoValidation
      });

    this.productBasicForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error('Error when subscribing on form valueChanges: ', er)
    );
  }

  modifyProduct() {
    const productBasicInfo = {
      id: this.productId,
      name: this.productBasicForm.controls['name'].value,
      base_price: this.productBasicForm.controls['base_price'].value,
      product_type: this.productBasicForm.controls['product_type'].value,
      brand: this.productBasicForm.controls['brand'].value,
      desc: this.productBasicForm.controls['desc'].value,
    };
    if (!this.productId) {
      delete productBasicInfo.id;
    }
    this.upsertBtnShouldDisabled = true;
    this.deleteBtnShouldDisabled = true;
    if (!this.productId) {
      this.httpService.put('product', productBasicInfo).subscribe(
        (data) => {
          this.snackBar.open('Product is added', null, {
            duration: 2300,
          });
          this.productBasicForm.reset();

          this.upsertBtnShouldDisabled = true;
          this.deleteBtnShouldDisabled = true;
          this.initForm();
          this.anyChanges = false;
        },
        (err) => {
          console.error();
          this.snackBar.open('Cannot add this product. Try again', null, {
            duration: 3200,
          });
          this.upsertBtnShouldDisabled = false;
          this.deleteBtnShouldDisabled = false;
        }
      );
    }
    else {
      if (this.productId) {
        this.httpService.post('product', productBasicInfo).subscribe(
          (data) => {
            this.snackBar.open('Product is updated', null, {
              duration: 2300,
            });
            this.upsertBtnShouldDisabled = false;
            this.deleteBtnShouldDisabled = false;
            this.anyChanges = false;
          },
          (err) => {
            console.error();
            this.snackBar.open('Cannot update this product. Try again', null, {
              duration: 3200,
            });
            this.upsertBtnShouldDisabled = false;
            this.deleteBtnShouldDisabled = false;
          }
        );
      }
    }
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

  fieldChanged() {
    if (!this.loadedValue || !Object.keys(this.loadedValue))
      return;
    this.anyChanges = false;
    Object.keys(this.productBasicForm.controls).forEach(el => {
      const tempValue = this.loadedValue[el]._id ? this.loadedValue[el]._id : this.loadedValue[el];
      if (this.productBasicForm.controls[el].value !== tempValue ) {
        this.anyChanges = true;
      }
    });
  }

  basicInfoValidation(Ac: AbstractControl) {
  }

  ngOnDestroy() {
  }
}
