import {NgModule} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {AdminRouting} from './admin.routing';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule,
  MatProgressBarModule, MatRadioModule, MatSidenavModule,
  MatTabsModule, MatToolbarModule
} from '@angular/material';
import {SharedModule} from '../shared/shared.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {AdminAuthGuard} from './admin.auth.guard';


@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    HeaderComponent,
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
    MatMenuModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTabsModule,
    SharedModule,
  ],
  providers: [AdminAuthGuard],
})
export class AdminModule {
}
