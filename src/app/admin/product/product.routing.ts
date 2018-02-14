import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ProductViewComponent} from './components/product-view/product-view.component';
import {ProductBasicFormComponent} from './components/product-basic-form/product-basic-form.component';
import {AllProductsComponent} from './all-products.component';
import {ProductColorComponent} from './components/product-color/product-color.component';
import {ProductSizeComponent} from './components/product-size/product-size.component';
import {ProductFullInfoComponent} from './components/product-full-info/product-full-info.component';

const Product_ROUTES: Routes = [
  {path: '', component: AllProductsComponent, pathMatch: 'full'},
  {path: 'productInfo/:id', component: ProductFullInfoComponent},
  {path: 'productInfo', component: ProductFullInfoComponent},
  {path: 'productBasicForm/:id', component: ProductBasicFormComponent},
  {path: 'productBasicForm', component: ProductBasicFormComponent},
  {path: 'productColor/:id', component: ProductColorComponent},
  {path: 'productSize/:id', component: ProductSizeComponent},
  {path: ':id', component: ProductViewComponent}
];

export const ProductRouting = RouterModule.forChild(Product_ROUTES);
export const ProductTestRouting = RouterTestingModule.withRoutes(Product_ROUTES);
