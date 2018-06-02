import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {DeliveryCostComponent} from './delivery-cost.component';

const DELIVERY_COST_ROUTES: Routes = [
  {path: '', component: DeliveryCostComponent, pathMatch: 'full'},
];

export const DeliveryCostRouting = RouterModule.forChild(DELIVERY_COST_ROUTES);
export const DeliveryCosTestRouting = RouterTestingModule.withRoutes(DELIVERY_COST_ROUTES);
