import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {UploadComponent} from './upload.component';

const PAGE_ROUTES: Routes = [
  {path: '', component: UploadComponent, pathMatch: 'full'},
];

export const PageRouting = RouterModule.forChild(PAGE_ROUTES);
export const PageTestRouting = RouterTestingModule.withRoutes(PAGE_ROUTES);
