import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySalesReportRouting } from './daily-sales-report.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTabsModule,
  MatCheckboxModule,
  MatTableModule, MatSelectModule, MAT_DIALOG_DATA, MatDialogRef
} from '@angular/material';
import {DailySalesReportComponent} from './daily-sales-report.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [DailySalesReportComponent],
  imports: [
    CommonModule,
    DailySalesReportRouting,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],

  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class DailySalesReportModule { }
