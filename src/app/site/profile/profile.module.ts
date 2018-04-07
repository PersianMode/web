import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import {ProfileRouting} from './profile.routing';
import { OrdersComponent } from './components/orders/orders.component';
import {SharedModule} from '../../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ProfileRouting,
    SharedModule,
    FlexLayoutModule,
    MatCardModule,
  ],
  declarations: [BasicInfoComponent, OrdersComponent, ProfileComponent]
})
export class ProfileModule { }
