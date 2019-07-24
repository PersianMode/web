import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {NgxMdModule} from 'ngx-md';
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
    NgxMdModule.forRoot(),
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
