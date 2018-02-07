import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections.component';
import {CollectionsRouting} from "./collections.routing";
import { ViewComponent } from './components/view/view.component';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardActions, MatCardHeader, MatCardModule, MatGridListModule, MatIconModule,
  MatInputModule, MatSelectModule
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import { FormComponent } from './components/form/form.component';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    CollectionsRouting,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatAutocompleteModule,
    SharedModule,
  ],
  declarations: [
    CollectionsComponent,
    ViewComponent,
    FormComponent,
  ]
})
export class CollectionsModule { }
