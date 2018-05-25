import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SoldOutComponent} from './soldout.component';


const SoldOut_Routes: Routes = [
  {path: '', component: SoldOutComponent , pathMatch: 'full'},
];

export const SoldOutRouting = RouterModule.forChild(SoldOut_Routes);
export const SoldOutTestRouting = RouterTestingModule.withRoutes(SoldOut_Routes);
