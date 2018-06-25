import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {DeliveryCostComponent} from './delivery-cost.component';
import {DurationFormComponent} from './components/duration-form/duration-form.component';

const DELIVERY_COST_ROUTES: Routes = [
  {path: '', component: DeliveryCostComponent, pathMatch: 'full'},
  {path: ':id', component: DeliveryCostComponent, pathMatch: 'full'},
  {path: 'duration/:id', component: DurationFormComponent},
];

export const DeliveryCostRouting = RouterModule.forChild(DELIVERY_COST_ROUTES);
export const DeliveryCosTestRouting = RouterTestingModule.withRoutes(DELIVERY_COST_ROUTES);
