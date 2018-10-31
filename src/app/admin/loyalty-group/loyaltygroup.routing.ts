import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {LoyaltyGroupComponent} from './loyaltygroup.component';

const ORDER_ROUTES: Routes = [
  {path: '', component: LoyaltyGroupComponent, pathMatch: 'full'},
];

export const LoyaltyGroupRouting = RouterModule.forChild(ORDER_ROUTES);
export const LoyaltyGroupTestRouting = RouterTestingModule.withRoutes(ORDER_ROUTES);
