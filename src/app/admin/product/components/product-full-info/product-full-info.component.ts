import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {IType} from '../../interfaces/itype';
import {IColor} from '../../interfaces/icolor';
import {IBrand} from '../../interfaces/ibrand';
import {IWarehouse} from '../../interfaces/iwarehouse';
import {ProgressService} from '../../../../shared/services/progress.service';

// TODO: // import {IProductColor} from '../../interfaces/iproduct-color';

@Component({
  selector: 'app-product-full-info',
  templateUrl: './product-full-info.component.html',
  styleUrls: ['./product-full-info.component.css']
})
export class ProductFullInfoComponent implements OnInit, OnDestroy {

  productId: string;
  product: any = {};
  types: IType[];
  brands: IBrand[];
  warehouses: IWarehouse[];

  constructor(private httpService: HttpService, private route: ActivatedRoute, private progressService: ProgressService) {

  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.productId = params['id'];
        if (this.productId)
          this.getProduct();
      });

    this.getTypes();
    this.getBrands();
    this.getWarehouses();
  }


  getProduct() {
    this.progressService.enable();
    this.httpService.get(`/product/${this.productId}`).subscribe(
      (data) => {
        console.log('-> ', data);
        this.product = data;
        this.progressService.disable();
      },
      (err) => {
        this.progressService.disable();
        console.error('Cannot get product ... ', err);
      }
    );

  }


  getTypes() {
    this.httpService.get(`productType`).subscribe(res => {
      this.types = res;
    }, err => {
      console.error();
    });
  }

  getBrands() {
    this.httpService.get(`brand`).subscribe(res => {
      this.brands = res;
    }, err => {
      console.error();
    });
  }

  getWarehouses(): any {
    this.httpService.get(`warehouse/all`).subscribe(res => {
      this.warehouses = res;
    }, err => {
      console.error();
    });
  }


  ngOnDestroy() {
    this.product = null;
  }

}
