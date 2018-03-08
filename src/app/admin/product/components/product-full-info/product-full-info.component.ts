import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
// TODO: // import {IProductColor} from '../../interfaces/iproduct-color';
import {IType} from '../../interfaces/itype';
import {IColor} from '../../interfaces/icolor';
import {IBrand} from '../../interfaces/ibrand';
import {IWarehouse} from '../../interfaces/iwarehouse';

@Component({
  selector: 'app-product-full-info',
  templateUrl: './product-full-info.component.html',
  styleUrls: ['./product-full-info.component.css']
})
export class ProductFullInfoComponent implements OnInit, OnDestroy {

  productId: string;
  product: any = {};
  productColors: any;
  types: IType[];
  colors: IColor[];
  brands: IBrand[];
  warehouses: IWarehouse[];

  constructor(private httpService: HttpService, private route: ActivatedRoute) {
  }

  setProductId($event) {
    this.productId = $event;
  }

  ngOnInit() {

    this.route.params.subscribe(
      (params) => {
        this.productId = params['id'];
        if (this.productId)
          this.getProductColors();
      });

    this.getColors();
    this.getTypes();
    this.getBrands();
    this.getWarehouses();
  }

  getProductColors() {
    this.httpService.get(`product/color/${this.productId}`).subscribe(res => {
      // console.log(this.productId);
      this.productColors = res.colors;
    }, err => {
      console.error();
    });
  }

  getColors() {
    this.httpService.get(`color`).subscribe(res => {
      this.colors = res;
    }, err => {
      console.error();
    });
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
    this.httpService.get(`warehouse`).subscribe(res => {
      this.warehouses = res;
    }, err => {
      console.error();
    });
  }


  ngOnDestroy() {
  }

  setProductColors(productColors: any) {
    this.productColors = productColors;
  }
}
