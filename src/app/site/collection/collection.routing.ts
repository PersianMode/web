import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {MainCollectionComponent} from './components/main-collection/main-collection.component';

const Collection_ROUTES: Routes = [
  {path: ':name', component: MainCollectionComponent}
];

export const CollectionRouting = RouterModule.forChild(Collection_ROUTES);
export const CollectionTestRouting = RouterTestingModule.withRoutes(Collection_ROUTES);
