import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {CheckoutPageComponent} from './checkout-page/checkout-page.component';

const checkoutRoutes: Routes = [
  {path: '', component: CheckoutPageComponent, pathMatch: 'full'},
];

export const CheckoutRouting = RouterModule.forChild(checkoutRoutes);
export const CheckoutTestRouting = RouterTestingModule.withRoutes(checkoutRoutes);
