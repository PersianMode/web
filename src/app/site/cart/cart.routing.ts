import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {CartItemsComponent} from './components/cart-items/cart-items.component';
import {CartComponent} from './cart.component';

const Cart_ROUTES: Routes = [
  {path: '', component: CartComponent, pathMatch: 'full'},
  {path: 'cartItem', component: CartItemsComponent, pathMatch: 'full'},
];
export const CartRouting = RouterModule.forChild(Cart_ROUTES);
export const CartTestRouting = RouterTestingModule.withRoutes(Cart_ROUTES);
