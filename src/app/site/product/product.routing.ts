import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ProductComponent} from './components/product/product.component';

const Collection_ROUTES: Routes = [
  {path: ':product_id', component: ProductComponent},
];

export const ProductRouting = RouterModule.forChild(Collection_ROUTES);
export const ProductTestRouting = RouterTestingModule.withRoutes(Collection_ROUTES);
