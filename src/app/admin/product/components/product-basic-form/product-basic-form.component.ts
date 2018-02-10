import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-basic-form',
  templateUrl: './product-basic-form.component.html',
  styleUrls: ['./product-basic-form.component.css']
})
export class ProductBasicFormComponent implements OnInit {
  // @Input()
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
  upsertBtnShouldDisabled = false;
  deleteBtnShouldDisabled = false;
  productId = null;
  anyChanges = false;

  constructor(private httpService: HttpService , private snackBar: MatSnackBar,  private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log('*********');
    this.initForm();

    this.route.params.subscribe(
      (params) => {
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
    };
    console.log('==>', productBasicInfo);
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

        if (!this.productId) {
          this.productBasicForm.reset();
        } else {
          this.originalProductBasicForm = Object.assign({id : data.id}, productBasicInfo);
          this.productId = data;
        }
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
      },
      (err) => {
        console.error();
        this.snackBar.open('Cannot ' + this.productId ? 'add' : 'update' + ' this product. Try again', null, {
          duration: 3200,
        });
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
      }
    );
  }
  openView(id: string = null) {
    this.router.navigate([`/agent/products/${id}`]);
  }
  deleteProduct() {
  }
  basicInfoValidation(Ac: AbstractControl) {
  }
}
