import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RouterTestingModule} from '@angular/router/testing';

const LOGIN_Routes: Routes = [
  {path: '', component: LoginComponent, pathMatch: 'full'},
];

export const LoginRouting = RouterModule.forChild(LOGIN_Routes);
export const LoginTestRouting = RouterTestingModule.withRoutes(LOGIN_Routes);
