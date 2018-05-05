import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable()
export class TitleService {

  constructor(private titleService: Title) {
  }

  readonly constTitle = 'پرشین مد';
  static collection_name = 'کلکسیون';

  setTitleWithConstant(newTitle: string = '') {
    let names = [this.constTitle];
    if (newTitle)
      names.push(newTitle);
    this.titleService.setTitle(names.join(': '))
  }

  setTitleWithOutConstant(title: string) {
    this.titleService.setTitle(title);

  }

}
