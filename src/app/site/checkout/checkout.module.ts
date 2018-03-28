import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddressTableComponent} from './address-table/address-table.component';
import {CheckoutPageComponent} from './checkout-page/checkout-page.component';
import {CheckoutRouting} from './checkout.routing';
import {
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    CheckoutRouting,
    FlexLayoutModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
  ],
  declarations: [
    CheckoutPageComponent,
    AddressTableComponent,
  ]
})
export class CheckoutModule {
}
