import {NgModule} from '@angular/core';
import {HomeComponent} from './components/home.component';
import {HomeRouting} from './home.routing';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HomeRouting,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
  ],
})
export class HomeModule {
}
