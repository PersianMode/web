import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {HomeComponent} from './home/home.component';
import {AdminAuthGuard} from './admin.auth.guard';

const Admin_ROUTES: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {path: '', redirectTo: 'collections', pathMatch: 'full'},
      {path: 'collections', loadChildren: 'app/admin/collections/collections.module#CollectionsModule', canActivate: [AdminAuthGuard]},
      {path: 'login', loadChildren: 'app/admin/login/login.module#LoginModule'},
      {path: 'products', loadChildren: 'app/admin/product/product.module#ProductModule', canActivate: [AdminAuthGuard]},
      {path: 'campaigns', loadChildren: 'app/admin/campaign/campaign.module#CampaignModule', canActivate: [AdminAuthGuard]},
      {path: 'pages', loadChildren: 'app/admin/page/page.module#PageModule', canActivate: [AdminAuthGuard]},
      {path: 'orders', loadChildren: 'app/admin/order/order.module#OrderModule', canActivate: [AdminAuthGuard]},
      {path: 'dictionary', loadChildren: 'app/admin/dictionary/dictionary.module#DictionaryModule', canActivate: [AdminAuthGuard]},
      {path: 'soldouts', loadChildren: 'app/admin/soldout/soldout.module#SoldOutModule', canActivate: [AdminAuthGuard]},
      {path: 'uploads', loadChildren: 'app/admin/upload/upload.module#UploadModule', canActivate: [AdminAuthGuard]},
      {
        path: 'loyaltygroup',
        loadChildren: 'app/admin/loyalty-group/loyaltygroup.module#LoyaltyGroupModule',
        canActivate: [AdminAuthGuard]
      },
    ]
  },
];

export const AdminRouting = RouterModule.forChild(Admin_ROUTES);
export const AdminTestRouting = RouterTestingModule.withRoutes(Admin_ROUTES);
