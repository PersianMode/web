import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderComponent} from './order.component';
import {OrderRouting} from './order.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    OrderComponent,
  ],
  imports: [
    OrderRouting,
    CommonModule,
    SharedModule,
  ],
})
export class OrderModule {
}
