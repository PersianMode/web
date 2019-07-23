import {NgModule} from '@angular/core';
import {SiteRouting} from './site.routing';
import {CommonModule} from '@angular/common';
import {SiteComponent} from './site.component';
import {HeaderComponent} from '../shared/components/header/header.component';
import {CollectionHeaderComponent} from '../shared/components/collection-header/collection-header.component';
import {SlidingHeaderComponent} from '../shared/components/sliding-header/sliding-header.component';
import {MobileHeaderComponent} from '../shared/components/mobile-header/mobile-header.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import {RouterModule} from '@angular/router';
import {UpsertAddressComponent} from '../shared/components/upsert-address/upsert-address.component';
import {AuthGuard} from './auth.guard';
import {OrderLinesComponent} from './profile/components/order-lines/order-lines.component';
import { ForgotPasswordComponent } from './login/components/forgot-password/forgot-password.component';
import { OrderReturnComponent } from './profile/components/order-return/order-return.component';
import {OtherDetailsComponent} from './login/components/other-details/other-details.component';
import {ProductService} from '../shared/services/product.service';
import {BlockUIModule} from 'primeng/blockui';
import { ShopResultComponent } from './shop-result/shop-result.component';


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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    DpDatePickerModule,
    MatListModule,
    MatSliderModule,
    SharedModule,
    MatTooltipModule,
    BlockUIModule,
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
    ForgotPasswordComponent,
    OauthHandlerComponent,
    OtherDetailsComponent,
    RegisterComponent,
    UpsertAddressComponent,
    GenDialogComponent,
    OrderLinesComponent,
    OrderReturnComponent,
    ShopResultComponent
  ],
  entryComponents: [GenDialogComponent],
  providers: [AuthGuard]
})
export class SiteModule {
}
