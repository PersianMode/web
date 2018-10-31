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
  MatButtonToggleModule,
  MatExpansionModule,
  MatTooltipModule,
  MatRadioModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CheckoutPageComponent} from './checkout-page/checkout-page.component';
import { PaymentTypeComponent } from './payment-type/payment-type.component';
import { CheckoutSummaryComponent } from './checkout-summary/checkout-summary.component';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {MarkdownModule} from 'angular2-markdown';
import {SharedModule} from '../../shared/shared.module';
import { CheckoutWarningConfirmComponent } from './checkout-warning-confirm/checkout-warning-confirm.component';

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
    PaymentTypeComponent,
    CheckoutSummaryComponent,
    CheckoutWarningConfirmComponent,
  ],
  entryComponents:[CheckoutWarningConfirmComponent],
})
export class CheckoutModule {
}
