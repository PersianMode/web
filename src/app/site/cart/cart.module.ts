import {NgModule} from '@angular/core';
import { CartComponent } from './cart.component';
import { SummaryComponent } from './components/summary/summary.component';
import { CartItemsComponent } from './components/cart-items/cart-items.component';
import {CartRouting} from './cart.routing';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatSelectModule,
  MatSnackBarModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {SharedModule} from '../../shared/shared.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { PriceFormatPipe } from './@pipes/price-format.pipe';

@NgModule({
  declarations: [
    SummaryComponent,
    CartItemsComponent,
    CartComponent,
    EditOrderComponent,
    PriceFormatPipe,
  ],
  imports: [
    CartRouting,
    SharedModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [EditOrderComponent],
})
export class CartModule {
}
