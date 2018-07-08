import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {PageComponent} from './page.component';
import {PageBasicInfoComponent} from './components/page-basic-info/page-basic-info.component';

const PAGE_ROUTES: Routes = [
  {path: '', component: PageComponent, pathMatch: 'full'},
  {path: 'info/:id', component: PageBasicInfoComponent},
];

export const PageRouting = RouterModule.forChild(PAGE_ROUTES);
export const PageTestRouting = RouterTestingModule.withRoutes(PAGE_ROUTES);
