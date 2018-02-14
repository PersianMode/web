import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IColor} from '../../interfaces/icolor';
import {IProductColor} from '../../interfaces/iproduct-color';
import {HttpService} from '../../../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-color',
  templateUrl: './product-color.component.html',
  styleUrls: ['./product-color.component.css']
})
export class ProductColorComponent implements OnInit {

  productColorForm: FormGroup;
  colors: IColor[] = [
    {
      _id: '5a8402148a4c831e60ce8cc4',
      name: 'سبز',
      color_id: '101'
    },
    {
      _id: '5a84022d8a4c831e60ce8cc5',
      name: 'قرمز',
      color_id: '102'
    },
    {
      _id: '5a8402498a4c831e60ce8cc6',
      name: 'صورتی',
      color_id: '103'
    },
    {
      _id: '5a8402628a4c831e60ce8cc7',
      name: 'بنفش',
      color_id: '104'
    }];

  productColors: IProductColor[] = [];
  selectedColorId: string = null;
  productId: string = null;
  constructor(private httpService: HttpService, private sanitizer: DomSanitizer, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.productId = params['id'] ? params['id'] : null;
        // if (this.productId) {
        //   this.progressService.enable();
        //   //
        //   // this.httpService.get(`/product/${this.productId}`).subscribe(
        //   //   (data) => {
        //   //     this.product = data.body;
        //   //     this.progressService.disable();
        //   //   },
        //   //   (err) => {
        //   //     this.progressService.disable();
        //   //     console.error('Cannot get product info. Error: ', err);
        //   //   }
        //   // );
        // }
      });
    this.initForm();
    this.getProductColors();
  }

  initForm() {
    this.productColorForm = new FormBuilder().group({
        proColor: [null, [
          Validators.required,
        ]],
      },
    );
  }

  getProductColors() {
    this.httpService.get(`product/color/${this.productId}`).subscribe(res => {
      this.productColors = [];
      res.body.colors.forEach(color => {

        this.productColors.push(color);
      });

      console.log('-> ', this.productColors);
    }, err => {
    });


  }

  removeImg(id: string) {

  }

  addToTable(images: any) {

    const pc = this.productColors.filter(x => x.info._id === this.selectedColorId)[0];

    if (pc) {
      pc.images = pc.images.concat(images);
    } else {
      const newProductColor: IProductColor = {
        images: images,
        info: this.colors.filter(x => x._id === this.selectedColorId)[0],
        _id: null
      };
      this.productColors.push(newProductColor);
    }
  }

  getURL(path) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }
}
