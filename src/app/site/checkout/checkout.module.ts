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
  MatRadioModule, MatButtonToggleModule, MatExpansionModule, MatTooltipModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AddressTableComponent} from './address-table/address-table.component';
import {CheckoutPageComponent} from './checkout-page/checkout-page.component';
import { PaymentTypeComponent } from './payment-type/payment-type.component';
import { CheckoutSummaryComponent } from './checkout-summary/checkout-summary.component';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {MarkdownModule} from 'angular2-markdown';
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
    MatButtonToggleModule,
    MatExpansionModule,
    SwiperModule,
    MatTooltipModule,
    MarkdownModule,
    MatCheckboxModule,
    SharedModule,
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
