import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {RegisterComponent} from './components/register/register.component';

const Register_ROUTES: Routes = [
  {path: '', component: RegisterComponent, pathMatch: 'full'},
];

export const RegisterRouting = RouterModule.forChild(Register_ROUTES);
export const RegisterTestRouting = RouterTestingModule.withRoutes(Register_ROUTES);
