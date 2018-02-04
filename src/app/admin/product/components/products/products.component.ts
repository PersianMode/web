import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';

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

  constructor() { }

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
      validator: this.basicInfoValidation;
    });
  }

  initProductBasicInfo() {
    if(!this.productBasicFormId)
      return;
  }
  modifyProduct() {
  }

  basicInfoValidation(Ac: AbstractControl) {
    let proName = Ac.get('proName').value;
    let proPrice = Ac.get('proPrice').value;
    if (proName === null || isUndefined(proName))
      proName = '';
    if (proPrice === null || isUndefined(proPrice))
      proPrice = '';
    proName = proName.trim();
    proPrice = proPrice.trim();
    if ((!proName || proName === '') || (!proPrice || proPrice === '')) {
      if (!proName || proName === '') {
        Ac.get('proName').setErrors({beingNull: 'Name can not be null.'});
      }
      if (!proPrice || proPrice === '') {
        Ac.get('proPrice').setErrors({beingNull: 'name_fa can not be null.'});
      }
    } else {
      Ac.get('proName').setErrors(null);
      return null;
    }
  }

}
