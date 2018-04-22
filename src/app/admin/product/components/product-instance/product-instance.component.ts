import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
// TODO: // import {IProductColor} from '../../interfaces/iproduct-color';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IWarehouse} from '../../interfaces/iwarehouse';

@Component({
  selector: 'app-product-instance',
  templateUrl: './product-instance.component.html',
  styleUrls: ['./product-instance.component.css']
})
export class ProductInstanceComponent implements OnInit {

  @Input() product: any;
  @Input() productId;
  @Input() warehouses: IWarehouse[];

  productInstanceForm: FormGroup;
  private colorId;
  private instanceId;
  private warehouse_id;
  private inventory;
  instances = [];

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.productInstanceForm = new FormBuilder().group({
        proColorId: [null, [
          Validators.required,
        ]],
        instanceId: [null, [
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
        console.log(data);
        this.formChange();
      }
    );
  }

  private formChange() {
    const countCtrl = this.productInstanceForm.controls['count'];
    if (this.colorId !== this.productInstanceForm.controls['proColorId'].value ||
      this.instanceId !== this.productInstanceForm.controls['instanceId'].value ||
      this.warehouse_id !== this.productInstanceForm.controls['warehouseId'].value) {
      [this.colorId, this.instanceId, this.warehouse_id] =
        ['proColorId', 'instanceId', 'warehouseId'].map(ctrl => this.productInstanceForm.controls[ctrl].value);
      const prevInstance = this.product.instances.find(r => r._id === this.instanceId);
      this.instances = this.product.instances.filter(r => r.product_color_id === this.colorId);
      const tryCurInstance = prevInstance ? this.product.instances
        .find(r => r.product_color_id === this.colorId && r.size === prevInstance.size) : null;
      if (tryCurInstance && tryCurInstance._id !== prevInstance._id) {
        this.instanceId = tryCurInstance._id;
        this.productInstanceForm.controls['instanceId'].setValue(this.instanceId, {onlySelf: true});
      }

      if (this.warehouse_id && this.instanceId) {
        const instance = this.product.instances.find(r => r._id === this.instanceId);
        this.inventory = instance.inventory.find(r => r.warehouse_id === this.warehouse_id);
        if (this.inventory) {
          if (this.instanceId !== prevInstance)
            countCtrl.setValue(this.inventory.count);
        } else {
          this.inventory = {warehouse_id: this.warehouse_id, count: 0, reserved: 0};
          countCtrl.setValue(0);
          this.modifyInstance();
        }
      }
    } else if (this.inventory) {
      if (this.inventory && this.inventory.count !== countCtrl.value) {
        this.inventory.count = countCtrl.value;
        this.modifyInstance();
      }
    }
  }

  modifyInstance() {
    this.httpService.post('product/instance/inventory', {
      id: this.product._id,
      productInstanceId: this.instanceId,
      warehouseId: this.warehouse_id,
      count: this.inventory.count,
      reserved: this.inventory.reserved,
      price: this.productInstanceForm.controls['price'].value !== this.product.base_price ? this.productInstanceForm.controls['price'].value : null,
    })
      .subscribe(() => {
          console.log('inventory count changed');
          const i = this.product.instances.find(r => r._id === this.instanceId);
          const w = i ? i.inventory.find(r => r.warehouse_id = this.warehouse_id) : null;
          if (w) {
            w.count = this.inventory.count;
          } else if (i) {
            i.inventory.push({
              warehouse_id: this.warehouse_id,
              count: this.inventory.count,
              reserved: this.inventory.reserved
            });
          }
        },
        err => console.error(err)
      );
  }
}
