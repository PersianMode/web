import {RouterModule, Routes} from '@angular/router';
import {CollectionsComponent} from './collections.component';
import {ViewComponent} from './components/view/view.component';
import {FormComponent} from './components/form/form.component';

const Collections_ROUTES: Routes = [
  {path: '', component: CollectionsComponent, pathMatch: 'full'},
  {path: ':id', component: ViewComponent},
  {path: 'form/:id', component: FormComponent},
];

export const CollectionsRouting = RouterModule.forChild(Collections_ROUTES);
