import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {DeliverypriorityComponent} from './deliverypriority.component';

const ORDER_ROUTES: Routes = [
  {path: '', component: DeliverypriorityComponent, pathMatch: 'full'},
];

export const DeliveryPriorityRouting = RouterModule.forChild(ORDER_ROUTES);
export const DeliveryPriorityTestRouting = RouterTestingModule.withRoutes(ORDER_ROUTES);