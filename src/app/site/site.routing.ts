import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SiteComponent} from './site.component';
import {LoginComponent} from './login/components/login/login.component';
import {RegisterComponent} from './register/components/register/register.component';
import {OauthHandlerComponent} from './login/components/oauth-handler/oauth-handler.component';

import {UpsertAddressComponent} from '../shared/components/upsert-address/upsert-address.component';
import {AuthGuard} from './auth.guard';
import {OrderLinesComponent} from './profile/components/order-lines/order-lines.component';
import {ForgotPasswordComponent} from './login/components/forgot-password/forgot-password.component';
import { OrderReturnComponent } from './profile/components/order-return/order-return.component';
import {ShopResultComponent} from './shop-result/shop-result.component';

const Site_ROUTES: Routes = [
  {
    path: '', component: SiteComponent, children: [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', loadChildren: 'app/site/home/home.module#HomeModule'},
    {path: 'login/oauth/:link', component: OauthHandlerComponent},
    {path: 'login/oauth', component: OauthHandlerComponent},
    {path: 'login', component: LoginComponent},
    {path: 'checkout', loadChildren: 'app/site/checkout/checkout.module#CheckoutModule'},
    {path: 'register', component: RegisterComponent},
    {path: 'forgot/password', component: ForgotPasswordComponent},
    {path: 'collection', loadChildren: 'app/site/collection/collection.module#CollectionModule'},
    {path: 'page', loadChildren: 'app/site/page/page.module#PageModule'},
    {path: 'cart', loadChildren: 'app/site/cart/cart.module#CartModule'},
    {path: 'product', loadChildren: 'app/site/product/product.module#ProductModule'},
    {path: 'checkout/address', component: UpsertAddressComponent},
    {path: 'profile', loadChildren: 'app/site/profile/profile.module#ProfileModule', canActivate: [AuthGuard]},
    {path: 'profile/orderlines', component: OrderLinesComponent},
    {path: 'profile/orderlines/return', component: OrderReturnComponent},
    {path: 'shopResult/:tref/:iN/:iD', component: ShopResultComponent},
  ]
  }
];

export const SiteRouting = RouterModule.forChild(Site_ROUTES);
export const SiteTestRouting = RouterTestingModule.withRoutes(Site_ROUTES);
