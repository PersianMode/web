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
import {InboxComponent} from './components/inbox/inbox.component';
import {ProductViewerComponent} from './components/product-viewer/product-viewer.component';
import {DeliverComponent} from './components/deliver/deliver.component';
import {BarcodeCheckerComponent} from './components/barcode-checker/barcode-checker.component';
import {FlexLayoutModule} from '@angular/flex-layout';
<<<<<<< HEAD
import { TicketComponent } from './components/ticket/ticket.component';
import { SmInboxComponent } from './components/sm-inbox/sm-inbox.component';
import { SmDeliverComponent } from './components/sm-deliver/sm-deliver.component';
import { DeliveryShowComponent } from './components/delivery-show/delivery-show.component';

=======
import {TicketComponent} from './components/ticket/ticket.component';
import {DeliveryShelfCodeComponent} from './components/delivery-shelf-code/delivery-shelf-code.component';


>>>>>>> cf0ee154f78db20bcd79033f3130bf95884a6e5e
@NgModule({
  declarations: [
    OrderComponent,
    OrderAddressComponent,
    InboxComponent,
    SmInboxComponent,
    DeliverComponent,
    ProductViewerComponent,
    BarcodeCheckerComponent,
    TicketComponent,
<<<<<<< HEAD
    SmDeliverComponent,
    DeliveryShowComponent
=======
    DeliveryShelfCodeComponent
>>>>>>> cf0ee154f78db20bcd79033f3130bf95884a6e5e
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
<<<<<<< HEAD
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  entryComponents: [OrderAddressComponent,  ProductViewerComponent, TicketComponent, DeliveryShowComponent],
=======
  ],
  entryComponents: [OrderAddressComponent, ProductViewerComponent, TicketComponent, DeliveryShelfCodeComponent],
>>>>>>> cf0ee154f78db20bcd79033f3130bf95884a6e5e
})
export class OrderModule {
}
