import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderComponent} from './order.component';
import {OrderListComponent} from './order-list/order-list.component';
import {MatPaginatorModule, MatSortModule} from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OrderRouting} from './order.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    OrderRouting,
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  declarations: [
    OrderComponent,
    OrderListComponent
  ],
})
export class OrderModule {}
