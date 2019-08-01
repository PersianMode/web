import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {MainCollectionComponent} from './components/main-collection/main-collection.component';

const Collection_ROUTES: Routes = [
  {path: ':typeName', component: MainCollectionComponent},
  {path: ':typeName/:l1', component: MainCollectionComponent},
  {path: ':typeName/:l1/:l2', component: MainCollectionComponent},
  {path: ':typeName/:l1/:l2/:l3', component: MainCollectionComponent},
  // {path: ':typeName/:l1/:l2/:l3/:l4', component: MainCollectionComponent},
  // {path: ':typeName/:l1/:l2/:l3/:l4/:l5', component: MainCollectionComponent},
];

export const CollectionRouting = RouterModule.forChild(Collection_ROUTES);
export const CollectionTestRouting = RouterTestingModule.withRoutes(Collection_ROUTES);
