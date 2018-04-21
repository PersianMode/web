import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import {isUndefined, log} from 'util';
import {DictionaryService} from '../../services/dictionary.service';
import {sizeOptionsEnum} from '../../enum/sizeOptions.enum';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-size-picker',
  templateUrl: './size-picker.component.html',
  styleUrls: ['./size-picker.component.css']
})
export class SizePickerComponent implements OnInit {
  sizeSplits = [];
  shoesMap: any;
  @Input() gender: String = 'MENS';
  isEU = true;


  @Input()
  set sizes(productSizes) {
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

  @Output('value') value = new EventEmitter();
  val = 0;

  constructor(private dict: DictionaryService, private httpService: HttpService) {
  }

  ngOnInit() {
  }

  onChange(e) {
    this.val = e.value;
    this.value.emit(this.val);

    // if ( +e.value > 0 ) {
    //   this.val = +e.value;
    //   this.value.emit(+e.value);
    // }
    // else {
    //   this.val = e.value;
    //   // this.value.emit(e.value);
    //   let tempEmitValue = e.value;
    //   switch (e.value) {
    //     case 'XS' :
    //       tempEmitValue = sizeOptionsEnum.XS;
    //       break;
    //     case 'S' :
    //       tempEmitValue = sizeOptionsEnum.S;
    //       break;
    //     case 'M' :
    //       tempEmitValue = sizeOptionsEnum.M;
    //       break;
    //     case 'L' :
    //       tempEmitValue = sizeOptionsEnum.L;
    //       break;
    //     case 'XL' :
    //       tempEmitValue = sizeOptionsEnum.XL;
    //       break;
    //   }
    //   this.value.emit(tempEmitValue);
    // }
  }

  USToEU(oldSize) {
    this.gender = 'WOMENS';
    // this.gender = 'MENS';
    // this.gender = undefined;
    // this.gender = null;
    if (this.shoesMap === undefined || this.shoesMap === null || this.shoesMap === [])
      this.getEuroSize();
    console.log(this.shoesMap);
    let returnValue: String;
    if (!this.gender || this.gender === undefined || this.gender.toUpperCase() === 'MENS') {
      returnValue = this.shoesMap.men.find(size => size.us === oldSize).eu;
    } else if (this.gender.toUpperCase() === 'WOMENS') {
      returnValue = this.shoesMap.women.find(size => size.us === oldSize).eu;
    }
    if (returnValue === null)
      return oldSize;
    return returnValue;
  }

  getEuroSize() {
    this.httpService.get('../../../assets/shoesSize.json').subscribe(res => this.shoesMap = res);
  }

  getUserSizeType() {
    // get user size type
    // set isEU
  }

  changeSizeType() {
    this.isEU = !this.isEU;
    console.log('isEU :', this.isEU);
    // post user size type
  }
}
