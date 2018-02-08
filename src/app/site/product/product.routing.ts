import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {DesktopProductComponent} from './components/desktop-product/desktop-product.component';

const Collection_ROUTES: Routes = [
  {path: ':product_id', component: DesktopProductComponent},
];

export const ProductRouting = RouterModule.forChild(Collection_ROUTES);
export const ProductTestRouting = RouterTestingModule.withRoutes(Collection_ROUTES);
