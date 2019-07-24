import {NgModule} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {AdminRouting} from './admin.routing';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {SharedModule} from '../shared/shared.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {AdminAuthGuard} from './admin.auth.guard';
import {debounceTime, filter} from 'rxjs/operators';


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
