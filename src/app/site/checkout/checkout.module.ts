import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckoutRouting} from './checkout.routing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
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
