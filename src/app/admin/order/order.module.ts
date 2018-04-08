import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderComponent} from './order.component';
import {OrderTableComponent} from './components/order-table/order-table.component';
import {MatPaginatorModule, MatTableModule, MatSortModule} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OrderRouting} from './order.routing';
import {SharedModule} from '../../shared/shared.module';
import { OrderService } from './order.service';
import { OrderTicketComponent } from './components/order-ticket/order-ticket.component';

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
    OrderTableComponent,
    OrderTicketComponent
  ],
  providers: [OrderService]
})
export class OrderModule {}
