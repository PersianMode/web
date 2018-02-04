import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {MatSnackBar} from "@angular/material";
import {HttpService} from "../../../../shared/services/http.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
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
    if (!this.productBasicFormId)
      return;
  }
  modifyProduct() {
    const productBasicInfo = {
      productId: this.productBasicFormId,
      proName: this.productBasicForm.controls['proName'].value,
      proPrice: this.productBasicForm.controls['proPrice'].value,
      proType: this.productBasicForm.controls['proType'].value,
      proBrand: this.productBasicForm.controls['proBrand'].value,
      proDesc: this.productBasicForm.controls['proDesc'].value,
    }
    if (!this.productBasicFormId)
      delete productBasicInfo.productId;

    this.upsertBtnShouldDisabled = true;
    this.deleteBtnShouldDisabled = true;
    this.HttpService.post('user/profile', productBasicInfo).subscribe(
      (data) => {
        this.snackBar.open(this.formId ? 'Person is updated' : 'Person is added', null, {
          duration: 2300,
        });

        this.anyChanges = false;

        if (!this.formId) {
          this.form.reset();
          this.form.controls['notify_period'].setValue('d');
        } else {
          this.originalForm = Object.assign({pid: data.pid}, personData);
          this.formId = data;
        }

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
      },
      (err) => {
        this.snackBar.open('Cannot ' + this.formId ? 'add' : 'update' + ' this person. Try again', null, {
          duration: 3200,
        });
        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
      }
    );
  }
  deleteProduct(){
  }
  basicInfoValidation(Ac: AbstractControl) {
    // let proName = Ac.get('proName').value;
    // let proPrice = Ac.get('proPrice').value;
    // if (proName === null || isUndefined(proName))
    //   proName = '';
    // if (proPrice === null || isUndefined(proPrice))
    //   proPrice = '';
    // proName = proName.trim();
    // proPrice = proPrice.trim();
    // if ((!proName || proName === '') || (!proPrice || proPrice === '')) {
    //   if (!proName || proName === '') {
    //     Ac.get('proName').setErrors({beingNull: 'Name can not be null.'});
    //   }
    //   if (!proPrice || proPrice === '') {
    //     Ac.get('proPrice').setErrors({beingNull: 'name_fa can not be null.'});
    //   }
    // } else {
    //   Ac.get('proName').setErrors(null);
    //   return null;
    // }
  }

}
