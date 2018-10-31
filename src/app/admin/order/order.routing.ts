import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {OrderComponent} from './order.component';

const ORDER_ROUTES: Routes = [
  {path: '', component: OrderComponent, pathMatch: 'full'},
];

export const OrderRouting = RouterModule.forChild(ORDER_ROUTES);
export const OrderTestRouting = RouterTestingModule.withRoutes(ORDER_ROUTES);
