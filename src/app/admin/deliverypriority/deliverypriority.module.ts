import {NgModule} from '@angular/core';
import {DeliverypriorityComponent} from './deliverypriority.component';
import {DeliveryPriorityRouting} from './deliverypriority.routing';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'primeng/primeng';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
