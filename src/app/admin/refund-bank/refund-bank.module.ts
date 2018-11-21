import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundBankComponent } from './refund-bank.component';
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
  MatTableModule
} from '@angular/material';
import { SharedModule } from 'primeng/primeng';

@NgModule({
  declarations: [RefundBankComponent],
  imports: [
    CommonModule,
    RefundBankRouting,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    SharedModule
  ],
})
export class RefundBankModule { }
