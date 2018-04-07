import {NgModule} from '@angular/core';
import {SiteRouting} from './site.routing';
import {CommonModule} from '@angular/common';
import {SiteComponent} from './site.component';
import {HeaderComponent} from '../shared/components/header/header.component';
import {CollectionHeaderComponent} from '../shared/components/collection-header/collection-header.component';
import {SlidingHeaderComponent} from '../shared/components/sliding-header/sliding-header.component';
import {MobileHeaderComponent} from '../shared/components/mobile-header/mobile-header.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCardModule,
  MatFormFieldModule,
  MatMenuModule,
  MatInputModule,
  MatOptionModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatStepperModule, MatRadioModule,
} from '@angular/material';
import {AgmCoreModule} from '@agm/core';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {GenDialogComponent} from '../shared/components/gen-dialog/gen-dialog.component';
import {LoginComponent} from './login/components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './register/components/register/register.component';
import {OauthHandlerComponent} from './login/components/oauth-handler/oauth-handler.component';
import {SharedModule} from '../shared/shared.module';
import {OtherDetailsComponent} from './login/components/other-details/other-details.component';
import {RouterModule} from '@angular/router';
import {UpsertAddressComponent} from '../shared/components/upsert-address/upsert-address.component';

@NgModule({
  imports: [
    SiteRouting,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCheckboxModule,
    MatStepperModule,
    MatRadioModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    DpDatePickerModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtglbLDTFZFa1rE-glHm7bFxnp9iANHro'
    }),
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
    UpsertAddressComponent,
    GenDialogComponent,
    OtherDetailsComponent,
  ],
  entryComponents: [GenDialogComponent],
})
export class SiteModule {
}
