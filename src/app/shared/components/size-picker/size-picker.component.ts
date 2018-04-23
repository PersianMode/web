import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {DictionaryService} from '../../services/dictionary.service';
import {HttpService} from '../../services/http.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-size-picker',
  templateUrl: './size-picker.component.html',
  styleUrls: ['./size-picker.component.css']
})
export class SizePickerComponent implements OnInit {
  sizeSplits = [];
  @Input() gender: String = 'MENS';
  isShoes = true;
  isEU = true;
  productSize;


  @Input()
  set sizes(productSizes) {
    this.productSize = productSizes;
    if (this.productSize)
      this.isShoes = this.productSize[0].value !== this.USToEU(this.productSize[0].value);
    this.setProductSize(productSizes);
  }

  @Output('value') value = new EventEmitter();
  val = '';

  constructor(private dict: DictionaryService, private httpService: HttpService, private auth: AuthService) {
  }

  ngOnInit() {
    this.getUserSizeType();
  }

  onChange(e) {
    this.val = e.value;
    this.value.emit(this.val);
  }

  setProductSize(productSizes) {
    const temp = [];
    Object.assign(temp, productSizes);
    if (productSizes && productSizes.length) {
      productSizes.forEach((p, pi) => {
        if (!this.isEU)
          temp[pi].displayValue = this.dict.translateWord(p.value);
        else {
          temp[pi].displayValue = this.dict.translateWord(this.USToEU(p.value));
        }
      });
    }
    this.sizeSplits = [];
    while (temp && temp.length) {
      this.sizeSplits.push(temp.splice(0, 5));
    }
  }

  USToEU(oldSize) {
    let returnValue: any;
    if (!this.gender || this.gender.toUpperCase() === 'MENS') {
      returnValue = this.dict.shoesSizeMap.men.find(size => size.us === oldSize);
    } else if (this.gender.toUpperCase() === 'WOMENS') {
      returnValue = this.dict.shoesSizeMap.women.find(size => size.us === oldSize);
    }
    if (!returnValue || !returnValue.eu)
      return oldSize;
    return returnValue.eu;
  }

  getUserSizeType() {
    this.httpService.get(`customer/shoesType`).subscribe(res => {
      if (!res.shoesType) {
        this.isEU = false;
      } else {
        this.isEU = res.shoesType === 'EU';
      }
      this.setProductSize(this.productSize);
    }, err => {
      console.error(err);
    });
  }

  changeSizeType() {
    this.isEU = !this.isEU;
    this.setProductSize(this.productSize);
    const shoesType = this.isEU ? 'EU' : 'US';
    if (this.auth.isLoggedIn.getValue()) {
      this.httpService.post(`customer/shoesType`, {shoesType})
        .subscribe(() => {
        });
    }
  }
}
