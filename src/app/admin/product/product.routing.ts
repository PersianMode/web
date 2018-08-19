import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ProductsComponent} from './products.component';
import {ProductFullInfoComponent} from './components/product-full-info/product-full-info.component';

const Product_ROUTES: Routes = [
  {path: '', component: ProductsComponent, pathMatch: 'full'},
  {path: 'productInfo/:id', component: ProductFullInfoComponent},
  {path: 'productInfo', component: ProductFullInfoComponent},
];

export const ProductRouting = RouterModule.forChild(Product_ROUTES);
export const ProductTestRouting = RouterTestingModule.withRoutes(Product_ROUTES);
