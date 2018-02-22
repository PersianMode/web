import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatNativeDateModule, MatSelectModule,
  MatSnackBarModule, MatTabsModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {PageRouting} from './page.routing';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import {PageComponent} from './page.component';

@NgModule({
  declarations: [
    PageComponent,
    BasicInfoComponent
  ],
  imports: [
    PageRouting,
    SharedModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatTabsModule,
    SharedModule,
  ],
})
export class PageModule {
}
