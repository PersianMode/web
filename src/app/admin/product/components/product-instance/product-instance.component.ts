import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
// TODO: // import {IProductColor} from '../../interfaces/iproduct-color';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IWarehouse} from '../../interfaces/iwarehouse';
import {log} from 'util';
import {ProgressService} from '../../../../shared/services/progress.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-product-instance',
  templateUrl: './product-instance.component.html',
  styleUrls: ['./product-instance.component.css']
})
export class ProductInstanceComponent implements OnInit, OnChanges {

  @Input() product: any;
  @Input() warehouses: IWarehouse[];

  productInstanceForm: FormGroup;

  proColorId: string;
  instances: any[] = [];
  size: string;
  warehouseId: string;

  submitShouldBeDisabled = false;

  constructor(private httpService: HttpService, private progeressService: ProgressService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.initForm();
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.product && this.product._id &&
      this.product.colors && this.product.colors.length &&
      this.product.instances && this.product.instances.length) {

      this.productInstanceForm.controls['proColorId'].setValue(this.product.colors[0]._id);


      this.changeColor(this.product.colors[0]._id);

      console.log('-> ', this.product);


    }

  }


  changeColor(colorId) {

    this.proColorId = colorId;

    this.instances = this.product.instances.filter(x => x.product_color_id === this.proColorId);

    this.size = this.instances[0].size;
    this.warehouseId = this.instances[0].inventory[0].warehouse_id;

    this.productInstanceForm.controls['size'].setValue(this.size);
    this.productInstanceForm.controls['warehouseId'].setValue(this.warehouseId);
    this.productInstanceForm.controls['count'].setValue(this.instances[0].inventory[0].count);
    this.productInstanceForm.controls['price'].setValue(this.instances[0].price);

  }

  changeSize(size) {

    this.size = size;

    const instance = this.product.instances.find(x => x.product_color_id === this.proColorId && x.size === this.size);
    this.warehouseId = instance.inventory[0].warehouse_id;

    this.productInstanceForm.controls['warehouseId'].setValue(this.warehouseId);
    this.productInstanceForm.controls['count'].setValue(instance.inventory[0].count);
    this.productInstanceForm.controls['price'].setValue(instance.price);

  }

  changeWarehouse(warehouseId) {

    this.warehouseId = warehouseId;

    const instance = this.product.instances.find(x => x.product_color_id === this.proColorId && x.size === this.size);

    this.productInstanceForm.controls['count'].setValue(instance.inventory.find(x => x.warehouse_id === this.warehouseId).count);
    this.productInstanceForm.controls['price'].setValue(instance.price);

  }

  initForm() {
    this.productInstanceForm = new FormBuilder().group({
      proColorId: [null, [
        Validators.required,
      ]],
      size: [null, [
        Validators.required,
      ]],
      warehouseId: [null, [
        Validators.required,
      ]],
      count: [null, [
        Validators.required,
      ]],
      price: this.product.base_price,
    },
    );
    this.productInstanceForm.valueChanges.subscribe(
      data => {
        this.formChange();
      }
    );
  }

  private formChange() {


    if (!this.proColorId || !this.productInstanceForm.controls['proColorId'].value ||
      !this.size || !this.productInstanceForm.controls['size'].value ||
      !this.warehouseId || !this.productInstanceForm.controls['warehouseId'].value
    ) {
      return;
    }


    if (this.proColorId !== this.productInstanceForm.controls['proColorId'].value) {
      this.changeColor(this.productInstanceForm.controls['proColorId'].value);
      return;
    }

    if (this.size !== this.productInstanceForm.controls['size'].value) {

      this.changeSize(this.productInstanceForm.controls['size'].value);
      return;
    }

    if (this.warehouseId !== this.productInstanceForm.controls['warehouseId'].value) {

      this.changeWarehouse(this.productInstanceForm.controls['warehouseId'].value);
      return;
    }



  }
  modifyInstance() {

    const foundInstance = this.product.instances.find(x => x.product_color_id === this.proColorId && x.size === this.size);
    const inventory = foundInstance.inventory.find(x => x.warehouse_id === this.warehouseId);


    this.submitShouldBeDisabled = true;
    this.progeressService.enable();

    this.httpService.post('product/instance/inventory', {
      id: this.product._id,
      productInstanceId: foundInstance._id,
      warehouseId: this.warehouseId,
      count: this.productInstanceForm.controls['count'].value,
      price: this.productInstanceForm.controls['price'].value
    }).subscribe(res => {

      inventory.count = this.productInstanceForm.controls['count'].value;
      foundInstance.price = this.productInstanceForm.controls['price'].value;

      this.submitShouldBeDisabled = false;
      this.progeressService.disable();

      this.openSnackBar('تغییرات با موفقیت ثبت شد');

    }, err => {
      this.submitShouldBeDisabled = false;
      this.progeressService.disable();
      this.openSnackBar('خطا در ثبت تغییرات');

    });



  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
