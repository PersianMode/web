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
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

import {GenDialogComponent} from '../shared/components/gen-dialog/gen-dialog.component';
import {LoginComponent} from './login/components/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './register/components/register/register.component';
import {OauthHandlerComponent} from './login/components/oauth-handler/oauth-handler.component';
import {SharedModule} from '../shared/shared.module';

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
    DpDatePickerModule,
    SharedModule,
  ],
  declarations: [
    HeaderComponent,
    CollectionHeaderComponent,
    SlidingHeaderComponent,
    FooterComponent,
    MobileHeaderComponent,
    SiteComponent,
    LoginComponent,
    OauthHandlerComponent,
    RegisterComponent,
    GenDialogComponent
  ],
  entryComponents: [GenDialogComponent],
})
export class SiteModule {
}
