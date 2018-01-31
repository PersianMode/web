import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SiteComponent} from './site.component';
import {HomeComponent} from './home/components/home.component';

const Site_ROUTES: Routes = [
  {
    path: '', component: SiteComponent, children: [
      {path: '', redirectTo: 'collection/x', pathMatch: 'full'},
      {path: 'home', loadChildren: 'app/site/home/home.module#HomeModule'},
      {path: 'login', loadChildren: 'app/site/login/login.module#LoginModule'},
      {path: 'collection', loadChildren: 'app/site/collection/collection.module#CollectionModule'},
      {path: 'cart', loadChildren: 'app/site/cart/cart.module#CartModule'},
  ]
  }
];

export const SiteRouting = RouterModule.forChild(Site_ROUTES);
export const SiteTestRouting = RouterTestingModule.withRoutes(Site_ROUTES);
