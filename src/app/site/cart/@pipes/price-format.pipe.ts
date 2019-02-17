import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat'
})
export class PriceFormatPipe implements PipeTransform {

  transform(value: any, format?: any): any {
    if (!value) {
      return;
    }
    if (value === '۰') {
      return value;
    }
    value = value + '۰';
    return value.split('٬').join(format);
  }

}
