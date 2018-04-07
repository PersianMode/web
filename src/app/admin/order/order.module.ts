import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderComponent} from './order.component';
import {OrderListComponent} from './order-list/order-list.component';
import {OrderRouting} from './order.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    OrderComponent,
    OrderListComponent
  ],
  imports: [
    OrderRouting,
    CommonModule,
    SharedModule,
  ],
})
export class OrderModule {
}
