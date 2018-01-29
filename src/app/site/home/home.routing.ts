import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home.component';
import {RouterTestingModule} from '@angular/router/testing';

const Home_ROUTES: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
];

export const HomeRouting = RouterModule.forChild(Home_ROUTES);
export const HomeTestRouting = RouterTestingModule.withRoutes(Home_ROUTES);
