import {NgModule} from '@angular/core';
import {DeliverypriorityComponent} from './deliverypriority.component';
import {DeliveryPriorityRouting} from './deliverypriority.routing';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'primeng/primeng';
import {MatCardModule, MatInputModule, MatIconModule, MatButtonModule, MatDialogModule} from '@angular/material';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

@NgModule({
  declarations: [DeliverypriorityComponent],
  imports: [
    DeliveryPriorityRouting,
    DragulaModule,
   
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
export class DeliverypriorityModule {
}
