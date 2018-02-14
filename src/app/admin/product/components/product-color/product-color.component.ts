import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IColor} from '../../interfaces/icolor';
import {IProductColor} from '../../interfaces/iproduct-color';
import {HttpService} from '../../../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-product-color',
  templateUrl: './product-color.component.html',
  styleUrls: ['./product-color.component.css']
})
export class ProductColorComponent implements OnInit {

  productColorForm: FormGroup;
  colors: IColor[] = [
    {
      _id: '5a814dc4bfa8b535fc01fac6',
      name: 'سبز',
      color_id: '101'
    },
    {
      _id: '5a814e02bfa8b535fc01fac7',
      name: 'قرمز',
      color_id: '102'
    },
    {
      _id: '5a814e14bfa8b535fc01fac8',
      name: 'صورتی',
      color_id: '103'
    },
    {
      _id: '5a814e24bfa8b535fc01fac9',
      name: 'بنفش',
      color_id: '104'
    }];

  productColors: IProductColor[] = [];
  selectedColorId: string = null;
  productId = '5a815bd7bfa8b535fc01fad2';

  constructor(private httpService: HttpService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

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
