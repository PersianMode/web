import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ProfileComponent} from './components/profile/profile.component';

const Profile_ROUTES: Routes = [
  {path: '', component: ProfileComponent, pathMatch: 'full'},

];
export const ProfileRouting = RouterModule.forChild(Profile_ROUTES);
export const ProfileTestRouting = RouterTestingModule.withRoutes(Profile_ROUTES);
