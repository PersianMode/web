import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ProductBasicFormComponent} from './components/product-basic-form/product-basic-form.component';

const Product_ROUTES: Routes = [
  {path: '', component: ProductBasicFormComponent, pathMatch: 'full'},
];

export const ProductRouting = RouterModule.forChild(Product_ROUTES);
export const ProductTestRouting = RouterTestingModule.withRoutes(Product_ROUTES);
