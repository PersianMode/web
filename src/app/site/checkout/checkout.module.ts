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
import {PaymentTypeComponent} from './payment-type/payment-type.component';
import {CheckoutSummaryComponent} from './checkout-summary/checkout-summary.component';
import {SharedModule} from '../../shared/shared.module';
import {AddressTableComponent} from '../../shared/components/address-table/address-table.component';
import {AgmCoreModule} from '@agm/core';

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
    SharedModule,
    MatCheckboxModule,
    MatRadioModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtglbLDTFZFa1rE-glHm7bFxnp9iANHro'
    }),
  ],
  declarations: [
    CheckoutPageComponent,
    PaymentTypeComponent,
    CheckoutSummaryComponent,
    AddressTableComponent,

  ],
})
export class CheckoutModule {
}
