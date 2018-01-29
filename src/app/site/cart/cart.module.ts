import {NgModule} from '@angular/core';
import { SummaryComponent } from './components/summary/summary.component';
import { CartItemsComponent } from './components/cart-items/cart-items.component';

@NgModule({
  declarations: [
    SummaryComponent,
    CartItemsComponent,
  ],
  imports: [],
})
export class CartModule {
}
