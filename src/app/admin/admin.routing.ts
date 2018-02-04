import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";

const Admin_ROUTES: Routes = [
  {path: '', component: HomeComponent, children: [
    {path: 'collections', loadChildren: 'app/admin/collections/collections.module#CollectionsModule'},
  ]},
];

export const AdminRouting = RouterModule.forChild(Admin_ROUTES);
