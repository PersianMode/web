import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class SpinnerService {

  isSpinner$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  // color$: BehaviorSubject<any> = new BehaviorSubject<any>('primary');
  // mode$: BehaviorSubject<any> = new BehaviorSubject<any>('indeterminate');
  // diameter$: BehaviorSubject<any> = new BehaviorSubject<any>(35);
  // strokeWidth$: BehaviorSubject<any> = new BehaviorSubject<any>(2);


  constructor() {}

  enable() {
    this.isSpinner$.next(true);
  }

  disable() {
    this.isSpinner$.next(false);
  }

}
