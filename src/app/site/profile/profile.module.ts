import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import {ProfileRouting} from './profile.routing';
import { OrdersComponent } from './components/orders/orders.component';
import {SharedModule} from '../../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatCardModule, MatFormFieldModule, MatHeaderRow, MatInputModule, MatRadioModule, MatRow, MatRowDef,
  MatTableModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {ProfileOrderService} from '../../shared/services/profile-order.service';

@NgModule({
  imports: [
    CommonModule,
    ProfileRouting,
    SharedModule,
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    DpDatePickerModule,
    ReactiveFormsModule,
  ],
  providers: [ProfileOrderService],
  declarations: [BasicInfoComponent, OrdersComponent, ProfileComponent]
})
export class ProfileModule { }
