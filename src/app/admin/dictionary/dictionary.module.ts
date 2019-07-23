import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DictionaryComponent} from './dictionary.component';
import {DictionaryRouting} from './dictionary.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
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
    MatFormFieldModule,
    MatButtonModule,
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
