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
  MatToolbarModule
} from '@angular/material';
import {SMOrderProcessComponent} from './components/sm-order-process/sm-order-process.component';
import {OrderAddressComponent} from './components/order-address/order-address.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { InboxComponent } from './components/inbox/inbox.component';
import { ProductViewerComponent } from './components/product-viewer/product-viewer.component';
import {DeliverComponent} from './components/deliver/deliver.component';
import { BarcodeCheckerComponent } from './components/barcode-checker/barcode-checker.component';


@NgModule({
  declarations: [
    OrderComponent,
    SMOrderProcessComponent,
    OrderAddressComponent,
    InboxComponent,
    DeliverComponent,
    ProductViewerComponent,
    BarcodeCheckerComponent,
  ],
  imports: [
    OrderRouting,
    CommonModule,
    FormsModule,
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
    MatCardModule
  ],
  entryComponents: [OrderAddressComponent, SMOrderProcessComponent,  ProductViewerComponent, BarcodeCheckerComponent],
})
export class OrderModule {
}
