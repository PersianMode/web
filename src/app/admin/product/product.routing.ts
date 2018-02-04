import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ProductsComponent} from './components/products/products.component';

const Product_ROUTES: Routes = [
  {path: '', component: ProductsComponent, pathMatch: 'full'},
];

export const ProductRouting = RouterModule.forChild(Product_ROUTES);
export const ProductTestRouting = RouterTestingModule.withRoutes(Product_ROUTES);
