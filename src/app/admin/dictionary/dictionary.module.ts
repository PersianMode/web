import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DictionaryComponent} from './dictionary.component';
import {DictionaryRouting} from './dictionary.routing';
import {
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule, MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatSnackBarModule,
  MatTableModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DictionaryRouting,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  declarations: [DictionaryComponent]
})
export class DictionaryModule {
}
