import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {DictionaryComponent} from './dictionary.component';


const Product_ROUTES: Routes = [
  {path: '', component: DictionaryComponent , pathMatch: 'full'},
];

export const DictionaryRouting = RouterModule.forChild(Product_ROUTES);
export const ProductTestRouting = RouterTestingModule.withRoutes(Product_ROUTES);
