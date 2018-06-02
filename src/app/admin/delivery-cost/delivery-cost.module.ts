import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeliveryCostComponent} from './delivery-cost.component';
import {DeliveryCostRouting} from './delivery-cost.routing';
import {SharedModule} from '../../shared/shared.module';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatDividerModule, MatIconModule, MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatRadioButton,
  MatRadioModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CitiesComponent} from './components/cities/cities.component';
import {CostComponent} from './components/cost/cost.component';
import {DurationComponent} from './components/duration/duration.component';
import {LoyaltyDiscountComponent} from './components/loyalty-discount/loyalty-discount.component';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    DeliveryCostComponent,
    CitiesComponent,
    CostComponent,
    DurationComponent,
    LoyaltyDiscountComponent,
  ],
  imports: [
    DeliveryCostRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
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
