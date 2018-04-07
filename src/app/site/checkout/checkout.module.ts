import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckoutRouting} from './checkout.routing';
import {
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatTableModule,
  MatIconModule, MatRadioModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CheckoutPageComponent} from './checkout-page/checkout-page.component';
import { PaymentTypeComponent } from './payment-type/payment-type.component';
import { CheckoutSummaryComponent } from './checkout-summary/checkout-summary.component';
import {SharedModule} from '../../shared/shared.module';

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
    MatCheckboxModule,
    SharedModule,
  ],
  declarations: [
    CheckoutPageComponent,
    PaymentTypeComponent,
    CheckoutSummaryComponent,
  ],
})
export class CheckoutModule {
}
