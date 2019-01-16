import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogisticComponent} from './logistic.component';
import {LogisticRouting} from './logistic.routing';
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
import {SmOrderComponent} from './components/sm-order/sm-order.component';
import {DeliveryShowComponent} from './components/delivery-show/delivery-show.component';
import {DeliveryShelfCodeComponent} from './components/delivery-shelf-code/delivery-shelf-code.component';
import {InboxComponent} from './components/inbox/inbox.component';
import {MismatchConfirmComponent} from './components/mismatch-confirm/mismatch-confirm.component';
import {InternalDeliveryBoxComponent} from './components/internal-delivery-box/internal-delivery-box.component';
import {ExternalDeliveryBoxComponent} from './components/external-delivery-box/external-delivery-box.component';
import {ShelvsViewComponent} from './components/shelvs-view/shelvs-view.component';
import {ReturnToWarehouseBoxComponent} from './components/return-to-warehouse-box/return-to-warehouse-box.component';
import {DeliveryComponent} from './components/delivery/delivery.component';
import {DeliveryTrackingComponent} from './components/delivery/components/delivery-tracking/delivery-tracking.component';
import {DeliveryHistoryComponent} from './components/delivery/components/delivery-history/delivery-history.component';
import {NewInternalDeliveryComponent} from './components/delivery/components/new-internal-delivery/new-internal-delivery.component';
import {DeliveryDetailsComponent} from './components/delivery/components/delivery-details/delivery-details.component';
import {ExpiredDateDialogComponent} from './components/delivery/components/expired-date-dialog/expired-date-dialog.component';
import { OrderLineViewerComponent } from './components/order-line-viewer/order-line-viewer.component';
import { ReturnDeliveryGeneratorComponent } from './components/sm-inbox/components/return-delivery-generator/return-delivery-generator.component';

@NgModule({
  declarations: [
    LogisticComponent,
    OrderAddressComponent,
    DeliveryComponent,
    NewInternalDeliveryComponent,
    DeliveryHistoryComponent,
    InboxComponent,
    SmInboxComponent,
    ProductViewerComponent,
    BarcodeCheckerComponent,
    TicketComponent,
    SmOrderComponent,
    DeliveryShowComponent,
    DeliveryShelfCodeComponent,
    MismatchConfirmComponent,
    InternalDeliveryBoxComponent,
    ExternalDeliveryBoxComponent,
    ShelvsViewComponent,
    ReturnToWarehouseBoxComponent,
    DeliveryTrackingComponent,
    DeliveryDetailsComponent,
    ExpiredDateDialogComponent,
    OrderLineViewerComponent,
    ReturnDeliveryGeneratorComponent
  ],
  imports: [
    LogisticRouting,
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
    MismatchConfirmComponent,
    DeliveryTrackingComponent,
    DeliveryDetailsComponent,
    ExpiredDateDialogComponent,
    OrderLineViewerComponent,
    ReturnDeliveryGeneratorComponent
  ]
})
export class LogisticModule {
}
