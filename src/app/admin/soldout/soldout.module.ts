import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SoldOutRouting} from './soldout.routing';
import {
  MatDialogModule, MatCardModule, MatGridListModule, MatIconModule,
  MatInputModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatCheckboxModule, MatFormFieldModule,
  MatProgressSpinnerModule, MatTableModule, MatButtonModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ColorPickerModule} from 'primeng/primeng';
import {SoldOutComponent} from './soldout.component';

@NgModule({
  imports: [
    CommonModule,
    SoldOutRouting,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatIconModule,
    MatSnackBarModule,
    ColorPickerModule,
    FlexLayoutModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    SoldOutComponent
  ]
})
export class SoldOutModule {
}
