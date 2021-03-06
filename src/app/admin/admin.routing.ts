import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {HomeComponent} from './home/home.component';
import {AdminAuthGuard} from './admin.auth.guard';
import {DailySalesReportModule} from './daily-sales-report/daily-sales-report.module';

const Admin_ROUTES: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {path: '', redirectTo: 'collections', pathMatch: 'full'},
      {path: 'collections', loadChildren: 'app/admin/collections/collections.module#CollectionsModule', canActivate: [AdminAuthGuard]},
      {path: 'login', loadChildren: 'app/admin/login/login.module#LoginModule'},
      {path: 'deliverypriority', loadChildren: 'app/admin/deliverypriority/deliverypriority.module#DeliverypriorityModule', canActivate: [AdminAuthGuard]},
      {path: 'products', loadChildren: 'app/admin/product/product.module#ProductModule', canActivate: [AdminAuthGuard]},
      {path: 'campaigns', loadChildren: 'app/admin/campaign/campaign.module#CampaignModule', canActivate: [AdminAuthGuard]},
      {path: 'pages', loadChildren: 'app/admin/page/page.module#PageModule', canActivate: [AdminAuthGuard]},
      {path: 'logistic', loadChildren: 'app/admin/logistic/logistic.module#LogisticModule', canActivate: [AdminAuthGuard]},
      {
        path: 'deliverycost',
        loadChildren: 'app/admin/delivery-cost/delivery-cost.module#DeliveryCostModule',
        canActivate: [AdminAuthGuard]
      },
      {path: 'dictionary', loadChildren: 'app/admin/dictionary/dictionary.module#DictionaryModule', canActivate: [AdminAuthGuard]},
      {path: 'soldouts', loadChildren: 'app/admin/soldout/soldout.module#SoldOutModule', canActivate: [AdminAuthGuard]},
      {path: 'uploads', loadChildren: 'app/admin/upload/upload.module#UploadModule', canActivate: [AdminAuthGuard]},
      {path: 'app_tracklist', loadChildren: 'app/admin/app-tracklist/app-tracklist.module#AppTracklistModule', canActivate: [AdminAuthGuard]},
      {
        path: 'loyaltygroup',
        loadChildren: 'app/admin/loyalty-group/loyaltygroup.module#LoyaltyGroupModule',
        canActivate: [AdminAuthGuard]
      },
      {

        path: 'refund_bank',
        loadChildren: 'app/admin/refund-bank/refund-bank.module#RefundBankModule',
        canActivate: [AdminAuthGuard]
      },
      {

        path: 'daily_report',
        loadChildren: 'app/admin/daily-sales-report/daily-sales-report.module#DailySalesReportModule',
        canActivate: [AdminAuthGuard]
      }
    ]
  },
];

export const AdminRouting = RouterModule.forChild(Admin_ROUTES);
export const AdminTestRouting = RouterTestingModule.withRoutes(Admin_ROUTES);
