import {Component, Input, OnDestroy, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
export class ProductBasicFormComponent implements OnInit, OnChanges, OnDestroy {

  productBasicForm: FormGroup = null;
  upsertBtnShouldDisabled = false;
  deleteBtnShouldDisabled = false;
  anyChanges = false;
  originalProduct: any = null;

  @Input() brands: IBrand[] = null;
  @Input() types: IType[] = null;
  @Input() product: any = null;

  constructor(private httpService: HttpService, private snackBar: MatSnackBar, private router: Router,
              public dialog: MatDialog, private progressService: ProgressService) {
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product && this.product._id) {
      if (!this.productBasicForm) {
        this.initForm();
      }

      this.originalProduct = Object.assign({}, this.product);
      this.productBasicForm.controls['name'].setValue(this.product.name);
      this.productBasicForm.controls['base_price'].setValue(this.product.base_price);
      if (this.types)
        this.productBasicForm.controls['product_type'].setValue(this.types.find(el => el.name.toLowerCase() === this.product.product_type.toLowerCase())._id);
      if (this.brands)
        this.productBasicForm.controls['brand'].setValue(this.brands.find(el => el.name.toLowerCase() === this.product.brand.toLowerCase())._id);
      this.productBasicForm.controls['desc'].setValue(this.product.desc);
    }

  }

  initForm() {
    this.productBasicForm = new FormBuilder().group({
        name: [null, [
          Validators.required,
        ]],
        base_price: [null, [
          Validators.required,
        ]],
        product_type: [null, [
          Validators.required,
        ]],
        brand: [null, [
          Validators.required,
        ]],
        desc: [null]
      },
      {
        validator: this.basicInfoValidation
      });

    this.productBasicForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error(er)
    );
  }

  modifyProduct() {
    const productBasicInfo = {
      id: this.product._id,
      name: this.productBasicForm.controls['name'].value,
      base_price: this.productBasicForm.controls['base_price'].value,
      product_type: this.productBasicForm.controls['product_type'].value,
      brand: this.productBasicForm.controls['brand'].value,
      desc: this.productBasicForm.controls['desc'].value,
    };
    this.upsertBtnShouldDisabled = false;
    this.deleteBtnShouldDisabled = false;


    const exec = this.httpService.post('product', productBasicInfo);

    exec.subscribe(
      (data) => {
        this.snackBar.open(`Product is updated`, null, {
          duration: 2300,
        });

        this.product.name = productBasicInfo.name;
        this.product.base_price = productBasicInfo.base_price;
        this.product.brand = this.brands.find(x => x._id === productBasicInfo.brand);
        this.product.product_type = this.types.find(x => x._id === productBasicInfo.product_type);
        this.product.desc = productBasicInfo.desc;

        this.upsertBtnShouldDisabled = true;
        this.deleteBtnShouldDisabled = true;
        this.anyChanges = false;

      },
      (err) => {
        console.error();
        this.snackBar.open(`Cannot update this product. Try again`, null, {
          duration: 3200,
        });
        this.upsertBtnShouldDisabled = true;
        this.deleteBtnShouldDisabled = true;
        this.anyChanges = false;
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
    if (!this.originalProduct) {
      return;
    }
    this.anyChanges = false;
    const name = this.productBasicForm.controls['name'].value ? this.productBasicForm.controls['name'].value : '';

    const base_price = this.productBasicForm.controls['base_price'].value ? this.productBasicForm.controls['base_price'].value : '';

    const brand_id = this.productBasicForm.controls['brand'].value;

    const product_type_id = this.productBasicForm.controls['product_type'].value;

    const desc = this.productBasicForm.controls['desc'].value;

    const orig_name = this.originalProduct.name;

    const orig_base_price = this.originalProduct.base_price;

    const orig_product_type_id = this.originalProduct.product_type.product_type_id;

    const orig_brand_id = this.originalProduct.brand.brand_id;

    const orig_desc = this.originalProduct.desc;


    if ((name !== orig_name && (name !== '' || orig_name !== null)) ||
      (desc !== orig_desc && (desc !== '' || orig_desc !== null)) ||
      (base_price !== orig_base_price && (base_price !== '' || orig_base_price !== null)) ||
      (orig_brand_id !== brand_id) ||
      (orig_product_type_id !== product_type_id)
    ) {
      this.anyChanges = true;
    }
  }

  basicInfoValidation(Ac: AbstractControl) {
  }

  ngOnDestroy() {
  }
}
