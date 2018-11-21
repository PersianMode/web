import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {DeliveryCostComponent} from './delivery-cost.component';
import {DurationFormComponent} from './components/duration-form/duration-form.component';
import {FreeDeliveryComponent} from './components/free-delivery/free-delivery.component';

const DELIVERY_COST_ROUTES: Routes = [
  {path: '', component: DeliveryCostComponent, pathMatch: 'full'},
  {path: ':id', component: DeliveryCostComponent, pathMatch: 'full'},
  {path: 'duration/:id', component: DurationFormComponent},
  {path: 'free/option', component: FreeDeliveryComponent}
];

export const DeliveryCostRouting = RouterModule.forChild(DELIVERY_COST_ROUTES);
export const DeliveryCosTestRouting = RouterTestingModule.withRoutes(DELIVERY_COST_ROUTES);
