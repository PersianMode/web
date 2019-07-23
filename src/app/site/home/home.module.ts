import {NgModule} from '@angular/core';
import {HomeComponent} from './components/home.component';
import {HomeRouting} from './home.routing';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    HomeRouting,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    SharedModule,
  ],
})
export class HomeModule {
}
