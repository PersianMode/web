import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {UploadComponent} from './upload.component';

const UPLOAD_ROUTES: Routes = [
  {path: '', component: UploadComponent, pathMatch: 'full'},
];

export const UploadRouting = RouterModule.forChild(UPLOAD_ROUTES);
export const UploadTestRouting = RouterTestingModule.withRoutes(UPLOAD_ROUTES);
