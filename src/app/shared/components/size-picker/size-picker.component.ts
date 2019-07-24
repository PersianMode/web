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
import {sizeSorter} from '../../lib/sizeSorter';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-size-picker',
  templateUrl: './size-picker.component.html',
  styleUrls: ['./size-picker.component.css']
})
export class SizePickerComponent implements OnInit {
  sizeSplits = [];
  _pt = '';
  _rb = false;
  @Input() gender: String = 'MENS';

  @Input()
  set productType(pt: string) {
    this._pt = pt;
    this.isShoes = pt.toUpperCase() === 'FOOTWEAR';
  };

  get productType(): string {
    return this._pt;
  }

  @Input()
  set redBorder(rb) {
    this._rb = rb;
    if (rb) {
      let i = 0;
      const interval = setInterval(() => {
        this._rb = !this._rb;
        if (i++ > 4) {
          clearInterval(interval);
        }
      }, 200);
    }
  }

  get redBorder() {
    return this._rb;
  }

  isShoes = false;
  isEU = true;
  productSize;


  @Input()
  set sizes(productSizes) {
    this.productSize = productSizes;
    this.productSize.sort(sizeSorter);
    this.setProductSize();
  }

  @Input()
  set selectedSize(value) {
    if (value)
      this.val = value;
  }

  @Input() displayTitle = true;

  @Output('value') value = new EventEmitter();
  val = '';

  constructor(private dict: DictionaryService, private httpService: HttpService, private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.isLoggedIn
      .pipe(filter(r => r))
      .subscribe(() => {
        this.isEU = this.auth.userDetails.shoesType !== 'US';
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
        temp[pi].displayValue = this.dict.setShoesSize(p.value, this.gender, this.productType);
      });
    }
    this.sizeSplits = [];
    while (temp && temp.length) {
      this.sizeSplits.push(temp.splice(0, 5));
    }
  }

  changeSizeType(change = true) {
    if (change)
      this.isEU = !this.isEU;
    const shoesType = this.isEU ? 'EU' : 'US';
    if (this.auth.userIsLoggedIn()) {
      this.httpService.post(`customer/shoesType`, {shoesType})
        .subscribe(() => {
        });
    }
    this.auth.userDetails.shoesType = shoesType;
    this.setProductSize();
  }
}
