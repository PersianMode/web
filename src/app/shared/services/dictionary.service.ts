import {Injectable} from '@angular/core';
import {safeColorConverter} from './colorConverter';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';

@Injectable()
export class DictionaryService {
  wordDictionary = {};
  colorDictionary = {};
  shoesSizeMap: any = {};
  isEU = false;

  constructor(httpService: HttpService, private auth: AuthService) {
    this.auth.isLoggedIn.subscribe(() => {
      this.isEU = this.auth.userDetails.shoesType === 'EU';
    });
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

  translateColor(col: any) {
    return col && col.name ? col.name.split('/').map(r => r.split('-'))
      .reduce((x, y) => x.concat(y)).map(r => this.translateWord(r)).join(' / ') : 'نامعین';
  }

  convertColor(color: string): string {
    let convertedColor = this.colorDictionary[color.toUpperCase()];
    if (!convertedColor) {
      convertedColor = color;
    }

    try {
      convertedColor = safeColorConverter(convertedColor);
    } catch (e) {
      return null;
    }

    return convertedColor;
  }

  setShoesSize(oldSize, gender, type) {
    this.isEU = this.auth.userDetails.shoesType === 'EU';
    if (type) {
      if (type.name)
        type = type.name;
      if (this.isEU && type.toUpperCase() === 'FOOTWEAR')
        return this.USToEU(oldSize, gender);
    }
    return this.translateWord(oldSize);

  }

  USToEU(oldSize, gender) {
    let returnValue: any;
    const g = (gender && gender.toUpperCase() === 'WOMENS') ? 'women' : 'men';
    if (this.shoesSizeMap[g])
      returnValue = this.shoesSizeMap[g].find(size => size.us === oldSize);

    if (!returnValue || !returnValue.eu)
      return this.translateWord(oldSize);

    return this.translateWord(returnValue.eu);
  }

}
