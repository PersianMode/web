import {NgModule} from '@angular/core';
import { HomeComponent } from './home/home.component';
import {AdminRouting} from "./admin.routing";
import {CommonModule} from "@angular/common";
import {
  MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatSidenavModule,
  MatTabsModule
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    AdminRouting,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    SharedModule,
  ]
})
export class AdminModule {
}
