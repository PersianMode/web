import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddressTableComponent} from './address-table/address-table.component';
import {CheckoutPageComponent} from './checkout-page/checkout-page.component';
import {CheckoutRouting} from './checkout.routing';
import {MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule,} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTableModule} from '@angular/material/table';
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
    SharedModule,
  ],
  declarations: [
    CheckoutPageComponent,
    AddressTableComponent,
  ],
})
export class CheckoutModule {
}
