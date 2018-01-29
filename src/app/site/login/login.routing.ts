import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

const Login_ROUTES: Routes = [
];

export const LoginRouting = RouterModule.forChild(Login_ROUTES);
export const LoginTestRouting = RouterTestingModule.withRoutes(Login_ROUTES);
