import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DeliveryRouting} from './delivery.routing';
import {DeliveryComponent} from './delivery.component';
import {SharedModule} from '../../shared/shared.module';
import {MatCardModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule} from '@angular/material';

@NgModule({
  declarations: [DeliveryComponent],
  imports: [
    DeliveryRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
  ],
})
export class DeliveryModule {
}
