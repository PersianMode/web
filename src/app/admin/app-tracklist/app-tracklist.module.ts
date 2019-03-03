import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDialogRef, MatIconModule, MatInputModule,
  MatPaginatorModule, MatSelectModule, MatSlideToggleModule,
  MatSnackBarModule, MatTableModule, MatTabsModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MarkdownModule} from 'angular2-markdown';
import {AppTrackListComponent} from './app-tracklist.component';
import {AppTrackListRouting} from './app-tracklist.routing';
import { UploadTrackComponent } from './component/upload-track/upload-track.component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
  declarations: [
    AppTrackListComponent,
    UploadTrackComponent,
  ],
  imports: [
    AppTrackListRouting,
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
    DragulaModule,
    MatTableModule
  ],
  entryComponents: [
    UploadTrackComponent,
  ],
  exports: [
    UploadTrackComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class AppTracklistModule {
}
