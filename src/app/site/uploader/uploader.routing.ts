import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {UploaderComponent} from './components/uploader/uploader.component';

const Uploader_ROUTES: Routes = [
  {path: '', component: UploaderComponent, pathMatch: 'full'},
];

export const UploaderRouting = RouterModule.forChild(Uploader_ROUTES);
export const UploaderTestRouting = RouterTestingModule.withRoutes(Uploader_ROUTES);
