import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {IProductColor} from '../../interfaces/iproduct-color';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IWarehouse} from '../../interfaces/iwarehouse';

@Component({
  selector: 'app-product-instance',
  templateUrl: './product-instance.component.html',
  styleUrls: ['./product-instance.component.css']
})
export class ProductInstanceComponent implements OnInit {

  @Input() productColors: IProductColor[];
  @Input() productId;
  @Input() warehouses: IWarehouse[];

  productInstanceForm: FormGroup;

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
        warehouseId: [null, [
          Validators.required,
        ]],
        count: [null, [
          Validators.required,
        ]],
        price: null
      },
    );
  }


  modifyInstance() {

  }
}
