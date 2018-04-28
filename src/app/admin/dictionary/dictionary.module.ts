import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DictionaryComponent} from './dictionary.component';
import {DictionaryRouting} from './dictionary.routing';
import {
  MatDialogModule, MatCardModule, MatGridListModule, MatIconModule,
  MatInputModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatCheckboxModule, MatFormFieldModule,
  MatProgressSpinnerModule, MatTableModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ModifyDictionaryComponent} from './components/modify-dictionary/modify-dictionary.component';
import {ColorPickerModule} from 'primeng/primeng';

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
    ColorPickerModule,
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
    ModifyDictionaryComponent
  ],
  entryComponents: [
    ModifyDictionaryComponent
  ]
})
export class DictionaryModule {
}
