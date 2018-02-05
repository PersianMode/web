import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ProductViewComponent} from './components/product-view/product-view.component';
import {ProductBasicFormComponent} from './components/product-basic-form/product-basic-form.component';
import {AllProductsComponent} from './all-products.component';

const Product_ROUTES: Routes = [
  {path: '', component: AllProductsComponent, pathMatch: 'full'},
  {path: 'productForm/:id', component: ProductBasicFormComponent},
  {path: ':id', component: ProductViewComponent}
];

export const ProductRouting = RouterModule.forChild(Product_ROUTES);
export const ProductTestRouting = RouterTestingModule.withRoutes(Product_ROUTES);
