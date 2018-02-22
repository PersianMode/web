import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {PageComponent} from './page.component';
import {BasicInfoComponent} from './components/basic-info/basic-info.component';

const PAGE_ROUTES: Routes = [
  {path: '', component: PageComponent, pathMatch: 'full'},
  {path: 'info/:id', component: BasicInfoComponent},
  {path: 'info', component: BasicInfoComponent},
];

export const PageRouting = RouterModule.forChild(PAGE_ROUTES);
export const PageTestRouting = RouterTestingModule.withRoutes(PAGE_ROUTES);
