import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {LogisticComponent} from './logistic.component';

const LOGISTIC_ROUTES: Routes = [
  {path: '', component: LogisticComponent, pathMatch: 'full'},
];

export const LogisticRouting = RouterModule.forChild(LOGISTIC_ROUTES);
export const LogisticTestRouting = RouterTestingModule.withRoutes(LOGISTIC_ROUTES);
