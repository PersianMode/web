import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeliveryCostComponent} from './delivery-cost.component';
import {DeliveryCostRouting} from './delivery-cost.routing';
import {SharedModule} from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DurationComponent} from './components/duration/duration.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DurationFormComponent} from './components/duration-form/duration-form.component';
import {LoyaltyDiscountComponent} from './components/loyalty-discount/loyalty-discount.component';
import { CAndCComponent } from './components/c-and-c/c-and-c.component';
import { FreeDeliveryComponent } from './components/free-delivery/free-delivery.component';



@NgModule({
  declarations: [
    DeliveryCostComponent,
    DurationComponent,
    LoyaltyDiscountComponent,
    DurationFormComponent,
    CAndCComponent,
    FreeDeliveryComponent,
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
