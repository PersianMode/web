import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserWindowRef, WINDOW_PROVIDERS} from './shared/services/window.service';
import {HttpService} from './shared/services/http.service';
import {SocketService} from './shared/services/socket.service';
import {AuthService} from './shared/services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {routing} from './app.routing';
import {ProgressService} from './shared/services/progress.service';
import {SharedModule} from './shared/shared.module';
import {PageService} from './shared/services/page.service';
import {ProductService} from './shared/services/product.service';
import {ResponsiveService} from './shared/services/responsive.service';
import {CartService} from './shared/services/cart.service';
import {DictionaryService} from './shared/services/dictionary.service';
import {CheckoutService} from './shared/services/checkout.service';
import {ProfileOrderService} from './shared/services/profile-order.service';
import {TitleService} from './shared/services/title.service';
import {RevertPlacementService} from './shared/services/revert-placement.service';
import {PrintService} from './shared/services/print.service';
import {BlockUIModule} from 'primeng/blockui';
import {SpinnerService} from './shared/services/spinner.service';
import { MessageService } from './shared/services/message.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    routing,
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    BlockUIModule
  ],
  providers: [
    WINDOW_PROVIDERS,
    HttpService,
    SocketService,
    AuthService,
    ProgressService,
    BrowserWindowRef,
    PageService,
    ProductService,
    ResponsiveService,
    PrintService,
    CartService,
    TitleService,
    DictionaryService,
    CheckoutService,
    ProfileOrderService,
    RevertPlacementService,
    SpinnerService,
    MessageService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
