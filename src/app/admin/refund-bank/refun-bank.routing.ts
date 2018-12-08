import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {RefundBankComponent} from './refund-bank.component';

const PAGE_ROUTES: Routes = [
  {path: '', component: RefundBankComponent, pathMatch: 'full'},
];

export const RefundBankRouting = RouterModule.forChild(PAGE_ROUTES);
export const RefundBankTestRouting = RouterTestingModule.withRoutes(PAGE_ROUTES);
