import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SiteComponent} from './site.component';
import {LoginComponent} from './login/components/login/login.component';
import {RegisterComponent} from './register/components/register/register.component';
import {OauthHandlerComponent} from './login/components/oauth-handler/oauth-handler.component';

const Site_ROUTES: Routes = [
  {
    path: '', component: SiteComponent, children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', loadChildren: 'app/site/home/home.module#HomeModule'},
      // {path: 'login', loadChildren: 'app/site/login/login.module#LoginModule'},
      {path: 'login', component: LoginComponent},
      {path: 'login/oauth', component: OauthHandlerComponent},
      // {path: 'register', loadChildren: 'app/site/register/register.module#RegisterModule'},
      {path: 'register', component: RegisterComponent},
      {path: 'collection', loadChildren: 'app/site/collection/collection.module#CollectionModule'},
      {path: 'cart', loadChildren: 'app/site/cart/cart.module#CartModule'},
    ]
  }
];

export const SiteRouting = RouterModule.forChild(Site_ROUTES);
export const SiteTestRouting = RouterTestingModule.withRoutes(Site_ROUTES);
