import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundBankRouting } from './refun-bank.routing';
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
import {SmRefundFormBankComponent} from './sm-refund-form-bank/sm-refund-form-bank.component';
import {RefundBankComponent} from './refund-bank.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [RefundBankComponent, SmRefundFormBankComponent],
  imports: [
    CommonModule,
    RefundBankRouting,
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
  entryComponents: [SmRefundFormBankComponent],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class RefundBankModule { }
