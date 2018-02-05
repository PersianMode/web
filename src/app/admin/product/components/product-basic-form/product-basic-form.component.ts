import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-product-basic-form.component',
  templateUrl: './product-basic-form.component.html',
  styleUrls: ['./product-basic-form.component.css']
})
export class ProductBasicFormComponent implements OnInit {
  @Input()
  set productBasicFormId(id) {
    this._productBasicFormId = id;
  }
  get productBasicFormId() {
    return this._productBasicFormId;
  }
  productBasicForm: FormGroup;
  types = ['عینک آفتابی', 'تی شرت' , 'شلوار', 'کفش'];
  brands = ['نایک', 'آدیداس', 'پلیس' , 'گپ'];
  _productBasicFormId: number = null;
  originalProductBasicForm: any = null;
  upsertBtnShouldDisabled: boolean = false;
  deleteBtnShouldDisabled: boolean = false;

  constructor(private httpService: HttpService , private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.productBasicForm = new FormBuilder().group({
      proName : [null, [
        Validators.required,
      ]],
      proPrice : [null, [
        Validators.required,
      ] ],
      proType : [null,  [
        Validators.required,
      ]],
      proBrand : [null,  [
        Validators.required,
      ]],
      proDesc : [null, [
        Validators.maxLength(25),
      ]]
    },
      {
      validator: this.basicInfoValidation
    });
  }

  initProductBasicInfo() {
    if (!this.productBasicFormId) {
      return;
    }
  }
  modifyProduct() {
    const productBasicInfo = {
      id: this.productBasicFormId,
      name: this.productBasicForm.controls['proName'].value,
      base_price: this.productBasicForm.controls['proPrice'].value,
      // product_type: this.productBasicForm.controls['proType'].value,
      // brand: this.productBasicForm.controls['proBrand'].value,
      desc: this.productBasicForm.controls['proDesc'].value,
    }
    if (!this.productBasicFormId) {
      delete productBasicInfo.id;
    }
    this.upsertBtnShouldDisabled = true;
    this.deleteBtnShouldDisabled = true;
    this.httpService.put('product', productBasicInfo).subscribe(
      (data) => {
        this.snackBar.open(this.productBasicFormId ? 'Person is updated' : 'Person is added', null, {
          duration: 2300,
        });

        // this.anyChanges = false;
        if (!this.productBasicFormId) {
          this.productBasicForm.reset();
        } else {
          this.originalProductBasicForm = Object.assign({id : data.id}, productBasicInfo);
          this.productBasicFormId = data;
        }
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
      },
      (err) => {
        console.log('***', err);
        this.snackBar.open('Cannot ' + this.productBasicFormId ? 'add' : 'update' + ' this person. Try again', null, {
          duration: 3200,
        });
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
      }
    );
  }
  deleteProduct() {
  }
  basicInfoValidation(Ac: AbstractControl) {
  }

}
