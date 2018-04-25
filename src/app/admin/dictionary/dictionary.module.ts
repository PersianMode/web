import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DictionaryComponent} from './dictionary.component';
import {DictionaryRouting} from './dictionary.routing';
// import {
//   MatCardModule,
//   MatCheckboxModule,
//   MatDialogModule, MatIconModule,
//   MatPaginatorModule,
//   MatProgressSpinnerModule, MatSnackBarModule,
//   MatTableModule
// } from '@angular/material';
import {
  MatAutocompleteModule,
  MatButtonModule, MatDialogModule, MatCardModule, MatGridListModule, MatIconModule,
  MatInputModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatCheckboxModule, MatFormFieldModule,
  MatTabsModule, MatProgressSpinnerModule, MatTableModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AddDictionaryComponent } from './components/add-dictionary/add-dictionary.component';

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
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  declarations: [
    DictionaryComponent,
    AddDictionaryComponent
  ],
  entryComponents: [
    AddDictionaryComponent
  ]
})
export class DictionaryModule {
}
