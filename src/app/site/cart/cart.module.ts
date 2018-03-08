import {NgModule} from '@angular/core';
import { SummaryComponent } from './components/summary/summary.component';
import { CartItemsComponent } from './components/cart-items/cart-items.component';
import {CartRouting} from './cart.routing';
import { CartComponent } from './cart.component';

@NgModule({
  declarations: [
    SummaryComponent,
    CartItemsComponent,
    CartComponent,
  ],
  imports: [
    CartRouting,
  ],
})
export class CartModule {
}
