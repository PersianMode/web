import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderComponent} from './order.component';
import {OrderTableComponent} from './components/order-table/order-table.component';
import {OrderRouting} from './order.routing';
import {SharedModule} from '../../shared/shared.module';
import { OrderService } from './order.service';
import { OrderTicketComponent } from './components/order-ticket/order-ticket.component';
import {
  MatButtonModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatDividerModule, MatIconModule, MatInputModule, MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {OrderProcessComponent} from './components/order-process/order-process.component';
import {OrderAddressComponent} from './components/order-address/order-address.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [
    OrderRouting,
    CommonModule,
    FormsModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatRadioModule,
    MatIconModule,
    MatInputModule
  ],
  declarations: [
    OrderComponent,
    OrderTableComponent,
    OrderTicketComponent
  ],
  providers: [OrderService],
  entryComponents: [OrderAddressComponent, OrderProcessComponent],
})
export class OrderModule {}
