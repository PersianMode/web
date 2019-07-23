import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SoldOutRouting} from './soldout.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatSelectModule,
    ColorPickerModule,
    FlexLayoutModule,
    MatGridListModule,
    ReactiveFormsModule,
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
