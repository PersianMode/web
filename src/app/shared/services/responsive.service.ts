import {HostListener, Inject, Injectable} from '@angular/core';
import {WINDOW} from './window.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ResponsiveService {
 /*  As we cannot use @HostListener in a service,
  *  this service depends on SiteComponent to update its Subjects and values.
  */
  curWidth: number;
  curHeight: number;
  isMobile: boolean;
  resize$: Subject<number[]> = new Subject<number[]>();
  switch$: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }
}
