import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-basic-form.component',
  templateUrl: './product-basic-form.component.html',
  styleUrls: ['./product-basic-form.component.css']
})
export class ProductBasicFormComponent implements OnInit {
  @Input()
  // set productId(id) {
  //   this._productId = id;
  // }
  // get productId() {
  //   return this._productId;
  // }
  productBasicForm: FormGroup;
  types = ['عینک آفتابی', 'تی شرت' , 'شلوار', 'کفش'];
  brands = ['نایک', 'آدیداس', 'پلیس' , 'گپ'];
  originalProductBasicForm: any = null;
  upsertBtnShouldDisabled: boolean = false;
  deleteBtnShouldDisabled: boolean = false;
  productId = null;

  constructor(private httpService: HttpService , private snackBar: MatSnackBar,  private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      (params) => {
        console.log('===>', params);
        this.productId = +params['id'] ? +params['id'] : null;
        this.initProductBasicInfo();
      }
    );
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
        Validators.maxLength(50),
      ]]
    },
      {
      validator: this.basicInfoValidation
    });
  }

  initProductBasicInfo() {
    if (!this.productId) {
      this.productBasicForm = null;
      this.initForm();
      return;
    }
  }
  modifyProduct() {
    const productBasicInfo = {
      id: this.productId,
      name: this.productBasicForm.controls['proName'].value,
      base_price: this.productBasicForm.controls['proPrice'].value,
      // product_type: this.productBasicForm.controls['proType'].value,
      // brand: this.productBasicForm.controls['proBrand'].value,
      desc: this.productBasicForm.controls['proDesc'].value,
    }
    if (!this.productId) {
      delete productBasicInfo.id;
    }
    this.upsertBtnShouldDisabled = true;
    this.deleteBtnShouldDisabled = true;
    this.httpService.put('product', productBasicInfo).subscribe(
      (data) => {
        this.snackBar.open(this.productId ? 'Product is updated' : 'Product is added', null, {
          duration: 2300,
        });

        // this.anyChanges = false;
        if (!this.productId) {
          console.log('==>', this.productId);
          console.log('==>', data._id);
          console.log('==>', data);
          this.productBasicForm.reset();
        } else {
          this.originalProductBasicForm = Object.assign({id : data.id}, productBasicInfo);
          this.productId = data;
        }
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
      },
      (err) => {
        console.log('-->', err);
        this.snackBar.open('Cannot ' + this.productId ? 'add' : 'update' + ' this product. Try again', null, {
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
