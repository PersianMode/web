import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {BasicInfoComponent} from './components/basic-info/basic-info.component';

const Profile_ROUTES: Routes = [
  {path: '', component: BasicInfoComponent, pathMatch: 'full'},

];
export const ProfileRouting = RouterModule.forChild(Profile_ROUTES);
export const ProfileTestRouting = RouterTestingModule.withRoutes(Profile_ROUTES);
