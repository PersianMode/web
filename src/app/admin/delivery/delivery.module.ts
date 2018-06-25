import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DeliveryRouting} from './delivery.routing';
import {DeliveryComponent} from './delivery.component';
import {SharedModule} from '../../shared/shared.module';
import {
  MatCardModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatIconModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatSnackBarModule
} from '@angular/material';
import {DeliveryDetailsComponent} from './components/delivery-details/delivery-details.component';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [DeliveryComponent, DeliveryDetailsComponent],
  imports: [
    DeliveryRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  entryComponents: [DeliveryDetailsComponent],
})
export class DeliveryModule {
}
