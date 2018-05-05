import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable()
export class TitleService {

  constructor(private titleService: Title) {
  }

  readonly constTitle = 'Nike';

  setTitleWithConstant(newTitle: string) {
    this.titleService.setTitle(this.constTitle + ' ' + newTitle);
  }

  setTitleWithOutConstant(title: string) {
    this.titleService.setTitle(title);

  }

}
