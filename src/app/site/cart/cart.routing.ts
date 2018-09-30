import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {CartComponent} from './cart.component';

const Cart_ROUTES: Routes = [
  {path: '', component: CartComponent, pathMatch: 'full'},

];
export const CartRouting = RouterModule.forChild(Cart_ROUTES);
export const CartTestRouting = RouterTestingModule.withRoutes(Cart_ROUTES);
