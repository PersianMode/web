
import {RouterModule, Routes} from "@angular/router";

const APP_ROUTES: Routes = [
  {path: '', loadChildren: 'app/site/site.module#SiteModule'},
  {path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule'},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
