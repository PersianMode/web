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
  @Input() productType: string;
  isShoes = true;

  isEU = true;
  productSize;


  @Input()
  set sizes(productSizes) {
    this.productSize = productSizes;
    if (this.productSize)
      this.isShoes = !!+this.productSize[0].value;
    this.setProductSize();
  }

  @Output('value') value = new EventEmitter();
  val = '';

  constructor(private dict: DictionaryService, private httpService: HttpService, private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.isLoggedIn.filter(r => r).subscribe(() => {
      const prevIsEu = this.isEU;
      this.isEU = this.auth.userDetails.shoesType === 'EU';
      if (prevIsEu !== this.isEU)
        this.changeSizeType(false);
    });
  }

  onChange(e) {
    this.val = e.value;
    this.value.emit(this.val);
  }

  setProductSize() {
    const temp = [];
    Object.assign(temp, this.productSize);
    if (this.productSize && this.productSize.length) {
      this.productSize.forEach((p, pi) => {
        if (!this.isEU)
          temp[pi].displayValue = this.dict.translateWord(p.value);
        else {
          temp[pi].displayValue = this.USToEU(p.value);
        }
      });
    }
    this.sizeSplits = [];
    while (temp && temp.length) {
      this.sizeSplits.push(temp.splice(0, 5));
    }
  }

  USToEU(oldSize) {
    return this.dict.USToEU(oldSize, this.gender, this.productType);
  }

  changeSizeType(change = true) {
    if (change)
      this.isEU = !this.isEU;

    this.setProductSize();
    const shoesType = this.isEU ? 'EU' : 'US';
    if (this.auth.isLoggedIn.getValue()) {
      this.httpService.post(`customer/shoesType`, {shoesType})
        .subscribe(() => {
          this.auth.userDetails.shoesType = shoesType;
        });
    } else {
      this.auth.userDetails.shoesType = shoesType;
    }
  }
}
