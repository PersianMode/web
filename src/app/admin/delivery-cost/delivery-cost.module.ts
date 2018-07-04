import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeliveryCostComponent} from './delivery-cost.component';
import {DeliveryCostRouting} from './delivery-cost.routing';
import {SharedModule} from '../../shared/shared.module';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatDividerModule, MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatRadioButton,
  MatRadioModule, MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DurationComponent} from './components/duration/duration.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DurationFormComponent} from './components/duration-form/duration-form.component';
import {LoyaltyDiscountComponent} from './components/loyalty-discount/loyalty-discount.component';
import { CAndCComponent } from './components/c-and-c/c-and-c.component';



@NgModule({
  declarations: [
    DeliveryCostComponent,
    DurationComponent,
    LoyaltyDiscountComponent,
    DurationFormComponent,
    CAndCComponent,
  ],
  imports: [
    DeliveryCostRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    FlexLayoutModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatRadioModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule
  ],
  entryComponents: [],
})
export class DeliveryCostModule {
}
