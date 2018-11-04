import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class SpinnerService {

  isSpinner$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  isblock$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  constructor() {}

  enable() {
    this.isSpinner$.next(true);
    this.isblock$.next(true);
  }

  disable() {
    this.isSpinner$.next(false);
    this.isblock$.next(false);
  }

}
