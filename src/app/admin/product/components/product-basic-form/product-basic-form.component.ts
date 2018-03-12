import {Component, Input, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {IBrand} from '../../interfaces/ibrand';
import {IType} from '../../interfaces/itype';


@Component({
  selector: 'app-product-basic-form',
  templateUrl: './product-basic-form.component.html',
  styleUrls: ['./product-basic-form.component.css']
})
export class ProductBasicFormComponent implements OnInit, OnDestroy {
  productBasicForm: FormGroup;
  upsertBtnShouldDisabled = false;
  deleteBtnShouldDisabled = false;
  anyChanges = false;
  product: any = {};
  loadedValue: any = {};

  @Input() productId: string;
  @Input() brands: IBrand[];
  @Input() types: IType[];

  @Output() productIdEvent = new EventEmitter<string>();

  constructor(private httpService: HttpService, private snackBar: MatSnackBar, private router: Router,
              public dialog: MatDialog, private progressService: ProgressService) {
  }

  ngOnInit() {
    this.initForm();
    if (this.productId) {
      this.progressService.enable();
      this.httpService.get(`/product/${this.productId}`).subscribe(
        (data) => {
          this.product = data[0];
          this.loadedValue = data[0];
          this.progressService.disable();
          this.initForm();
        },
        (err) => {
          this.progressService.disable();
          console.error('Cannot get product info... Error: ', err);
        }
      );
    }

  }

  initForm() {
    this.productBasicForm = new FormBuilder().group({
        name: [(Object.keys(this.loadedValue).length && this.loadedValue.name) ? this.loadedValue.name : null, [
          Validators.required,
        ]],
        base_price: [(Object.keys(this.loadedValue).length && this.loadedValue.base_price) ? this.loadedValue.base_price : null, [
          Validators.required,
        ]],
        product_type: [(Object.keys(this.loadedValue).length && this.loadedValue.product_type._id) ?
          this.loadedValue.product_type._id : null, [
          Validators.required,
        ]],
        brand: [(Object.keys(this.loadedValue).length && this.loadedValue.brand._id) ? this.loadedValue.brand._id : null, [
          Validators.required,
        ]],
        desc: [(Object.keys(this.loadedValue).length && this.loadedValue.desc) ? this.loadedValue.desc : null, [
          Validators.maxLength(50),
        ]]
      // TODO: 'details' field should be added here, and some other places :D
      },
      {
        validator: this.basicInfoValidation
      });

    this.productBasicForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error('Error when subscribing on collection-basic-form valueChanges: ', er)
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
    this.upsertBtnShouldDisabled = false;
    this.deleteBtnShouldDisabled = false;


    const exec = this.productId ? this.httpService.post('product', productBasicInfo) : this.httpService.put('product', productBasicInfo);

    exec.subscribe(
      (data) => {
        this.snackBar.open(`Product is ${this.productId ? 'updated' : 'added' }`, null, {
          duration: 2300,
        });

        this.upsertBtnShouldDisabled = true;
        this.deleteBtnShouldDisabled = true;
        this.anyChanges = false;

        if (!this.productId) {
          this.productId = data._id;
          this.productIdEvent.emit(this.productId);
        }
      },
      (err) => {
        console.error();
        this.snackBar.open(`Cannot ${this.productId ? 'update' : 'add' } this product. Try again`, null, {
          duration: 3200,
        });
        this.upsertBtnShouldDisabled = true;
        this.deleteBtnShouldDisabled = true;
      }
    );
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
    if (!this.loadedValue || !Object.keys(this.loadedValue) || !Object.keys(this.loadedValue).length)
      return;

    this.anyChanges = false;
    Object.keys(this.productBasicForm.controls).forEach(el => {
      const tempValue = this.loadedValue[el]._id ? this.loadedValue[el]._id : this.loadedValue[el];
      if (this.productBasicForm.controls[el].value !== tempValue) {
        this.anyChanges = true;
      }
    });

    // TODO: changes should be captured here
  }

  basicInfoValidation(Ac: AbstractControl) {
  }

  ngOnDestroy() {
  }
}
