import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-product-color',
  templateUrl: './product-color.component.html',
  styleUrls: ['./product-color.component.css']
})
export class ProductColorComponent implements OnInit {

  productColorForm: FormGroup;
  anyChange = true;
  colors = ['صورتی', 'زرد' , 'سبز', 'قرمز'];
  selectedColor: any = [];
  productId = null;
  proPictures = {
  };
  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.productColorForm = new FormBuilder().group({
        proColor : [null, [
          Validators.required,
        ]],
      },
      {
        validator: this.colorInfoValidation
      });
  }
  modifyColor() {
    const testColor = this.productColorForm.controls['proColor'].value;
    const productColorInfo = {
      id: this.productId,
      color: testColor,
    }
    if (this.selectedColor.filter(el => el === this.productColorForm.controls['proColor'].value).length === 0) {
      this.selectedColor.push(testColor);
      this.proPictures.testColor = [];
    }
  }
  colorInfoValidation () {
  }
  removeImg() {
  }
  addPic() {
    if (this.proPictures.testColor) {
      this.proPictures.testColor.push('../../../../../assets/pictures/product-small/11.jpeg');
    }
  }
}
