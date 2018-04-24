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
import {FormsModule} from '@angular/forms';
import {SCOrderProcessComponent} from './components/sc-order-process/sc-order-process.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { OutboxComponent } from './components/outbox/outbox.component';
import { ProductViewerComponent } from './components/product-viewer/product-viewer.component';


@NgModule({
  declarations: [
    OrderComponent,
    SMOrderProcessComponent,
    SCOrderProcessComponent,
    OrderAddressComponent,
    InboxComponent,
    OutboxComponent,
    ProductViewerComponent,
  ],
  imports: [
    OrderRouting,
    CommonModule,
    FormsModule,
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
  entryComponents: [OrderAddressComponent, SMOrderProcessComponent, SCOrderProcessComponent, ProductViewerComponent],
})
export class OrderModule {
}
