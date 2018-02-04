import {NgModule} from '@angular/core';
import { HomeComponent } from './home/home.component';
import {AdminRouting} from './admin.routing';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    AdminRouting,
    CommonModule,
  ]
})
export class AdminModule {
}
