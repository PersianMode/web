import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

const Cart_ROUTES: Routes = [
];

export const CartRouting = RouterModule.forChild(Cart_ROUTES);
export const CartTestRouting = RouterTestingModule.withRoutes(Cart_ROUTES);
