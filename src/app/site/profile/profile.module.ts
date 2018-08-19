import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import {ProfileRouting} from './profile.routing';
import { OrdersComponent } from './components/orders/orders.component';
import {SharedModule} from '../../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatHeaderRow,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatRadioModule,
  MatTableModule,
  MatSlideToggleModule,
  MatListModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { PreferenceComponent } from './components/preference/preference.component';
import { OrderCancelComponent } from './components/order-cancel/order-cancel.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRouting,
    SharedModule,
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatRadioModule,
    DpDatePickerModule,
    ReactiveFormsModule,
    MatTableModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSlideToggleModule,

  ],
  declarations: [BasicInfoComponent, OrdersComponent, ProfileComponent, WishListComponent, PreferenceComponent, OrderCancelComponent],
})
export class ProfileModule { }
