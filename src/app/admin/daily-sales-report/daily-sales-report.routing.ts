import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {DailySalesReportComponent} from './daily-sales-report.component';

const PAGE_ROUTES: Routes = [
  {path: '', component: DailySalesReportComponent, pathMatch: 'full'},
];

export const DailySalesReportRouting = RouterModule.forChild(PAGE_ROUTES);
export const DailySalesReportTestRouting = RouterTestingModule.withRoutes(PAGE_ROUTES);
