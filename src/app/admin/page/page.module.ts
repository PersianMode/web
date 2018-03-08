import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule,
  MatPaginatorModule, MatSelectModule,
  MatSnackBarModule, MatTabsModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PageRouting} from './page.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {PageComponent} from './page.component';
import {PageBasicInfoComponent} from './components/page-basic-info/page-basic-info.component';
import {MarkdownModule} from 'angular2-markdown';

@NgModule({
  declarations: [
    PageComponent,
    PageBasicInfoComponent,
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
    MatPaginatorModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    SharedModule,
    MarkdownModule.forRoot(),
  ],
})
export class PageModule {
}
