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
  MatSelectModule
} from '@angular/material';
import {OrderAddressComponent} from './components/order-address/order-address.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductViewerComponent} from './components/product-viewer/product-viewer.component';
import {SendBoxComponent} from './components/send-box/send-box.component';
import {BarcodeCheckerComponent} from './components/barcode-checker/barcode-checker.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TicketComponent} from './components/ticket/ticket.component';
import {SmInboxComponent} from './components/sm-inbox/sm-inbox.component';
import {SmSendComponent} from './components/sm-send/sm-send.component';
import {DeliveryShowComponent} from './components/delivery-show/delivery-show.component';
import {DeliveryShelfCodeComponent} from './components/delivery-shelf-code/delivery-shelf-code.component';
import {InboxComponent} from './components/inbox/inbox.component';
import {DeliverBoxComponent} from './components/deliver-box/deliver-box.component';
import {MismatchConfirmComponent} from './components/mismatch-confirm/mismatch-confirm.component';
import { HubShelfOrderComponent } from './components/hub-shelf-order/hub-shelf-order.component';
import { SentCustomerComponent } from './components/sent-customer/sent-customer.component';
import { SentInternalHubComponent } from './components/sent-internal-hub/sent-internal-hub.component';
import { ReadyToSendComponent } from './components/sent-internal-hub/components/ready-to-send/ready-to-send.component';
import { PostedComponent } from './components/sent-internal-hub/components/posted/posted.component';

@NgModule({
  declarations: [
    OrderComponent,
    OrderAddressComponent,
    InboxComponent,
    SmInboxComponent,
    SendBoxComponent,
    ProductViewerComponent,
    BarcodeCheckerComponent,
    TicketComponent,
    SmSendComponent,
    DeliveryShowComponent,
    DeliveryShelfCodeComponent,
    DeliverBoxComponent,
    MismatchConfirmComponent,
    HubShelfOrderComponent,
    SentCustomerComponent,
    SentInternalHubComponent,
    ReadyToSendComponent,
    PostedComponent
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
    MatSelectModule
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
