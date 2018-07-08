<<<<<<< HEAD
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {MatButtonModule, MatCardModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WINDOW_PROVIDERS} from './shared/services/window.service';
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
  ],
  providers: [
    WINDOW_PROVIDERS,
    HttpService,
    SocketService,
    AuthService,
    ProgressService,
    PageService,
    ProductService,
    ResponsiveService,
    CartService,
    TitleService,
    DictionaryService,
    CheckoutService,
    ProfileOrderService,
    RevertPlacementService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
=======
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {MatButtonModule, MatCardModule, MatIconModule} from '@angular/material';
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
>>>>>>> ce66802f487ed15e4affdf252327bf155d7f3cc2
