import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderComponent} from './order.component';
import {OrderRouting} from './order.routing';
import {SharedModule} from '../../shared/shared.module';
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
  declarations: [
    OrderComponent,
    OrderProcessComponent,
    OrderAddressComponent,
  ],
  imports: [
    OrderRouting,
    CommonModule,
    FormsModule,
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatRadioModule,
    MatIconModule,
    MatInputModule
  ],
  entryComponents: [OrderAddressComponent, OrderProcessComponent],
})
export class OrderModule {
}
