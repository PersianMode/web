import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalDeliveryRouting } from './internal-delivery-routing';
import { InternalDeliveryComponent } from './internal-delivery.component';
import { MatCardModule, MatSelectModule, MatAutocompleteModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InternalDeliveryRouting,
    MatCardModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [InternalDeliveryComponent]
})
export class InternalDeliveryModule { }
