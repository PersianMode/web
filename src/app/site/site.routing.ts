import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SiteComponent} from './site.component';
import {LoginComponent} from './login/components/login/login.component';
import {RegisterComponent} from './register/components/register/register.component';
import {OauthHandlerComponent} from './login/components/oauth-handler/oauth-handler.component';
import {OtherDetailsComponent} from './login/components/other-details/other-details.component';
import {UpsertAddressComponent} from '../shared/components/upsert-address/upsert-address.component';
import {AuthGuard} from './auth.guard';

const Site_ROUTES: Routes = [
  {
    path: '', component: SiteComponent, children: [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', loadChildren: 'app/site/home/home.module#HomeModule'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'collection', loadChildren: 'app/site/collection/collection.module#CollectionModule'},
    {path: 'cart', loadChildren: 'app/site/cart/cart.module#CartModule', canActivate: [AuthGuard]},
    {path: 'product', loadChildren: 'app/site/product/product.module#ProductModule'},
    {path: 'login/oauth', component: OauthHandlerComponent},
    {path: 'login/oauth/other/:status', component: OtherDetailsComponent},
    {path: 'checkout', loadChildren: 'app/site/checkout/checkout.module#CheckoutModule', canActivate: [AuthGuard]},
    {path: 'checkout/address', component: UpsertAddressComponent},
    {path: 'profile', loadChildren: 'app/site/profile/profile.module#ProfileModule', canActivate: [AuthGuard]},
  ]
  }
];

export const SiteRouting = RouterModule.forChild(Site_ROUTES);
export const SiteTestRouting = RouterTestingModule.withRoutes(Site_ROUTES);
