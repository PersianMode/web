import {NgModule} from '@angular/core';
import {SiteRouting} from './site.routing';
import {CommonModule} from '@angular/common';
import {SiteComponent } from './site.component';
import {HeaderComponent} from '../shared/components/header/header.component';
import {CollectionHeaderComponent} from '../shared/components/collection-header/collection-header.component';
import {SlidingHeaderComponent} from '../shared/components/sliding-header/sliding-header.component';
import {MobileHeaderComponent} from '../shared/components/mobile-header/mobile-header.component';
import {
  MatButtonModule, MatDialogModule,
  MatIconModule,
  MatSidenavModule
} from '@angular/material';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {FlexLayoutModule} from '@angular/flex-layout';


import {GenDialogComponent} from '../shared/components/gen-dialog/gen-dialog.component';
import {LoginComponent} from './login/components/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from "@angular/flex-layout";
import {RegisterComponent} from "./register/components/register/register.component";

@NgModule({
  imports: [
    SiteRouting,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  declarations: [
    HeaderComponent,
    CollectionHeaderComponent,
    SlidingHeaderComponent,
    FooterComponent,
    MobileHeaderComponent,
    SiteComponent,
    GenDialogComponent,
    LoginComponent,
    RegisterComponent,
  ],
  entryComponents: [GenDialogComponent],
})
export class SiteModule {
}
