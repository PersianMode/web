import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections.component';
import {CollectionsRouting} from './collections.routing';
import { ViewComponent } from './components/view/view.component';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardActions, MatCardHeader, MatDialogModule, MatCardModule, MatGridListModule, MatIconModule,
  MatInputModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatCheckboxModule, MatFormFieldModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormComponent } from './components/form/form.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CollectionsRouting,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule,
  ],
  declarations: [
    CollectionsComponent,
    ViewComponent,
    FormComponent,
  ]
})
export class CollectionsModule { }
