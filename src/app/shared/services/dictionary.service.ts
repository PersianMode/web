import {Injectable} from '@angular/core';
import {colorConverter} from './colorConverter';
import {HttpService} from './http.service';

@Injectable()
export class DictionaryService {
  wordDictionary = {};
  colorDictionary = {};
  shoesSizeMap: any = {};

  constructor(httpService: HttpService) {
    httpService.get('dictionary').subscribe((res: any) => {
      res.forEach(x => {
        if (x.type === 'tag') {
          this.wordDictionary[x.name] = x.value;
        } else if (x.type === 'color') {
          this.colorDictionary[x.name] = x.value;
        }
      });
    });
    httpService.get('../../../assets/shoesSize.json').subscribe(res => {
      this.shoesSizeMap = res;
    });
  }

  translateWord(word: string | number): string {
    const translation = this.wordDictionary[(word + '').toUpperCase()];
    if (translation)
      return translation;
    else if (+word) {
      return (+word).toLocaleString('fa', {useGrouping: false});
    }
    return word + '';
  }

  convertColor(color: string): string {
    let convertedColor = this.colorDictionary[color.toUpperCase()];
    if (!convertedColor) {
      convertedColor = color;
    }

    try {
      convertedColor = colorConverter(convertedColor);
    } catch (e) {
      return null;
    }

    return convertedColor;
  }

  USToEU(oldSize, gender) {
    let returnValue: any;
    if (!gender ||  (gender && gender.toUpperCase() === 'MENS')) {
      returnValue = this.shoesSizeMap.men.find(size => size.us === oldSize);
    } else if (gender && gender.toUpperCase() === 'WOMENS') {
      returnValue = this.shoesSizeMap.women.find(size => size.us === oldSize);
    }
    if (!returnValue || !returnValue.eu)
      return this.translateWord(oldSize);
    return this.translateWord(returnValue.eu);
  }
}
