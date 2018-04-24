import {RouterModule, Routes} from '@angular/router';
// import {isDevMode} from '@angular/core';

const APP_ROUTES: Routes = [
  {path: '', loadChildren: 'app/site/site.module#SiteModule'},
  {path: 'agent', loadChildren: 'app/admin/admin.module#AdminModule'},
];

export const routing = RouterModule.forRoot(
  APP_ROUTES,
  // { enableTracing: isDevMode() }
  );
