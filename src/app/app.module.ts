import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {AdminModule} from './admin/admin.module';
import {SiteModule} from './site/site.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WindowService} from './shared/services/window.service';
import {HttpService} from './shared/services/http.service';
import {SocketService} from './shared/services/socket.service';
import {AuthService} from './shared/services/auth.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AdminModule,
    SiteModule,
    RouterModule.forRoot([]),
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [WindowService, HttpService, SocketService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
