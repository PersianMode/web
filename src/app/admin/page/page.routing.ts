import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {PageComponent} from './page.component';

const Page_ROUTES: Routes = [
  {path: '', component: PageComponent, pathMatch: 'full'},
];

export const PageRouting = RouterModule.forChild(Page_ROUTES);
export const PageTestRouting = RouterTestingModule.withRoutes(Page_ROUTES);
