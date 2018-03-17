import {Injectable} from '@angular/core';
import {colorConverter} from './colorConverter';
import {HttpService} from './http.service';

@Injectable()
export class DictionaryService {
  wordDictionary = {
    CAPS: 'کلاه کپی',
    'ACTION SPORTS': 'ورزش‌های پرتحرک',
    UNISEX: 'تک‌جنسه',
    HEADWEAR: 'سرپوش',
    HOLI: 'کریسمس',
    TRAINING: 'ترینینگ',
    'DUFFEL BAGS': 'کوله خمره‌ای',
    MENS: 'مردانه',
    BAGS: 'کوله',
  };
  colorDictionary = {
    'UNIVERSITY RED': 'darkred',
    'ANTHRACITE': 'silver',
    'BLACK-ANTHRACITE': '#999999',
  };

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
}
