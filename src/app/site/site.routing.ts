import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RouterTestingModule} from '@angular/router/testing';

const Site_ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', loadChildren: 'app/site/login/login.module#LoginModule'},
];

export const SiteRouting = RouterModule.forChild(Site_ROUTES);
export const SiteTestRouting = RouterTestingModule.withRoutes(Site_ROUTES);
