import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {HomeComponent} from './home/home.component';


const Admin_ROUTES: Routes = [
  {path: '', redirectTo: 'admin/home', pathMatch: 'full'},
  {path: 'login', loadChildren: 'app/admin/login/login.module#LoginModule'},
  {path: 'product', loadChildren: 'app/admin/product/product.module#ProductModule'},
];

export const AdminRouting = RouterModule.forChild(Admin_ROUTES);
export const AdminTestRouting = RouterTestingModule.withRoutes(Admin_ROUTES);
