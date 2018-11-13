import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderComponent} from './order.component';
import {OrderRouting} from './order.routing';
import {SharedModule} from '../../shared/shared.module';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatDividerModule, MatIconModule, MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule, MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatToolbarModule,
  MatSelectModule,
  MatAutocompleteModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {OrderAddressComponent} from './components/order-address/order-address.component';
import {ProductViewerComponent} from './components/product-viewer/product-viewer.component';
import {BarcodeCheckerComponent} from './components/barcode-checker/barcode-checker.component';
import {TicketComponent} from './components/ticket/ticket.component';
import {SmInboxComponent} from './components/sm-inbox/sm-inbox.component';
import {SmSendComponent} from './components/sm-send/sm-send.component';
import {DeliveryShowComponent} from './components/delivery-show/delivery-show.component';
import {DeliveryShelfCodeComponent} from './components/delivery-shelf-code/delivery-shelf-code.component';
import {InboxComponent} from './components/inbox/inbox.component';
import {DeliverBoxComponent} from './components/deliver-box/deliver-box.component';
import {MismatchConfirmComponent} from './components/mismatch-confirm/mismatch-confirm.component';
import {InternalSendBoxComponent} from './components/internal-send-box/internal-send-box.component';
import {CustomerSendBoxComponent} from './components/customer-send-box/customer-send-box.component';
import {CustomerDeliveryComponent} from './components/customer-delivery/customer-delivery.component';
import {ShelvsViewComponent} from './components/shelvs-view/shelvs-view.component';

@NgModule({
  declarations: [
    OrderComponent,
    OrderAddressComponent,
    InboxComponent,
    SmInboxComponent,
    ProductViewerComponent,
    BarcodeCheckerComponent,
    TicketComponent,
    SmSendComponent,
    DeliveryShowComponent,
    DeliveryShelfCodeComponent,
    DeliverBoxComponent,
    MismatchConfirmComponent,
    InternalSendBoxComponent,
    CustomerSendBoxComponent,
    CustomerDeliveryComponent,
    ShelvsViewComponent
  ],
  imports: [
    OrderRouting,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatRadioModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  entryComponents: [
    OrderAddressComponent,
    ProductViewerComponent,
    TicketComponent,
    DeliveryShowComponent,
    DeliveryShelfCodeComponent,
    MismatchConfirmComponent],
})
export class OrderModule {
}
