import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections.component';
import {CollectionsRouting} from "./collections.routing";
import { ViewComponent } from './components/view/view.component';
import {MatButtonModule, MatCardActions, MatCardHeader, MatCardModule, MatIconModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import { FormComponent } from './components/form/form.component';

@NgModule({
  imports: [
    CommonModule,
    CollectionsRouting,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
  ],
  declarations: [
    CollectionsComponent,
    ViewComponent,
    FormComponent,
  ]
})
export class CollectionsModule { }
