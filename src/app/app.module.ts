import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    routing,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  providers: [WINDOW_PROVIDERS, HttpService, SocketService, AuthService, ProgressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
