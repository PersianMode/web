import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckoutRouting} from './checkout.routing';
import {
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatTableModule,
  MatIconModule,
  MatRadioModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AddressTableComponent} from './address-table/address-table.component';
import {CheckoutPageComponent} from './checkout-page/checkout-page.component';
import { PaymentTypeComponent } from './payment-type/payment-type.component';
import { CheckoutSummaryComponent } from './checkout-summary/checkout-summary.component';

@NgModule({
  imports: [
    CommonModule,
    CheckoutRouting,
    FlexLayoutModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
  ],
  declarations: [
    CheckoutPageComponent,
    AddressTableComponent,
    PaymentTypeComponent,
    CheckoutSummaryComponent,
  ],
})
export class CheckoutModule {
}
