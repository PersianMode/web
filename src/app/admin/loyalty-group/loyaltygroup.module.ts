import {NgModule} from '@angular/core';
import {LoyaltyGroupComponent} from './loyaltygroup.component';
import {LoyaltyGroupRouting} from './loyaltygroup.routing';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'primeng/primeng';
import {MatCardModule, MatInputModule, MatIconModule, MatButtonModule, MatDialogModule} from '@angular/material';

@NgModule({
  declarations: [LoyaltyGroupComponent],
  imports: [
    LoyaltyGroupRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class LoyaltyGroupModule {
}
