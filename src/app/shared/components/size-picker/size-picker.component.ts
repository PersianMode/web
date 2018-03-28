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

@Component({
  selector: 'app-size-picker',
  templateUrl: './size-picker.component.html',
  styleUrls: ['./size-picker.component.css']
})
export class SizePickerComponent implements OnInit {
  sizeSplits = [];

  @Input()
  set sizes(productSizes) {
    if (productSizes && productSizes.length) {
      productSizes.forEach((p, pi) => {
        productSizes[pi].displayValue = this.dict.translateWord(p.value);
      });
    }
    this.sizeSplits = [];
    while (productSizes && productSizes.length) {
      this.sizeSplits.push(productSizes.splice(0, 5));
    }
  }

  @Output('value') value = new EventEmitter();
  val = 0;

  constructor(private dict: DictionaryService) {
  }

  ngOnInit() {
  }

  onChange(e) {
    const sizeFirstCharCode = e.value.charCodeAt(0);
    this.val = (sizeFirstCharCode >= 48 && sizeFirstCharCode <= 57) ? +e.value : e.value;
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
}
