import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';

@Injectable()
export class SpinnerService {

  isSpinner$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor() {}

  enable() {
    this.isSpinner$.next(true);
  }

  disable() {
    this.isSpinner$.next(false);
  }

}
