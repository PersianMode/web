import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {LoginComponent} from './components/login/login.component';
import {OauthHandlerComponent} from './components/oauth-handler/oauth-handler.component';

const Login_ROUTES: Routes = [
  {path: '', component: LoginComponent, pathMatch: 'full'},
  {path: 'oauth', component: OauthHandlerComponent},
  // ToDo: a component should come here for the activation link or changing the password!
  // {path: 'activate/:link', component: ''},
];

export const LoginRouting = RouterModule.forChild(Login_ROUTES);
export const LoginTestRouting = RouterTestingModule.withRoutes(Login_ROUTES);
