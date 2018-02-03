import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AdminModule} from './admin/admin.module';
import {SiteModule} from './site/site.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WindowService} from './shared/services/window.service';
import {HttpService} from './shared/services/http.service';
import {SocketService} from './shared/services/socket.service';
import {AuthService} from './shared/services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {routing} from "./app.routing";

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
  ],
  providers: [WindowService, HttpService, SocketService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
