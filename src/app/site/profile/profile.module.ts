import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import {ProfileRouting} from './profile.routing';
import { OrdersComponent } from './components/orders/orders.component';
import {SharedModule} from '../../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatHeaderRow, MatTableModule } from '@angular/material/table';
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
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class ProfileModule { }
