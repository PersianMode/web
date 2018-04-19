import {RouterModule, Routes} from '@angular/router';
import {CollectionsComponent} from './collections.component';
import {CollectionFullInfoComponent} from './components/collection-full-info/collection-full-info.component';

const Collections_ROUTES: Routes = [
  {path: '', component: CollectionsComponent, pathMatch: 'full'},
  {path: 'form/:id', component: CollectionFullInfoComponent},
  {path: 'form', component: CollectionFullInfoComponent},
];

export const CollectionsRouting = RouterModule.forChild(Collections_ROUTES);
