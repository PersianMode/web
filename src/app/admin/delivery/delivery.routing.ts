import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {DeliveryComponent} from './delivery.component';

const Delivery_ROUTES: Routes = [
  {path: '', component: DeliveryComponent, pathMatch: 'full'},
];

export const DeliveryRouting = RouterModule.forChild(Delivery_ROUTES);
export const DeliveryTestRouting = RouterTestingModule.withRoutes(Delivery_ROUTES);
