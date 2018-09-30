import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {PageComponent} from './components/page/page.component';


const Page_ROUTES: Routes = [
  {path: ':typeName', component: PageComponent},
];

export const PageRouting = RouterModule.forChild(Page_ROUTES);
export const PageTestRouting = RouterTestingModule.withRoutes(Page_ROUTES);
