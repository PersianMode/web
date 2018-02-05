import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatNativeDateModule, MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ProductRouting} from './product.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AllProductsComponent } from './all-products.component';
import {ProductBasicFormComponent} from './components/product-basic-form/product-basic-form.component';


@NgModule({
  declarations: [
    ProductBasicFormComponent,
    AllProductsComponent
  ],
  imports: [
  ProductRouting,
  CommonModule,
  MatButtonModule,
  MatIconModule,
  FlexLayoutModule,
  FormsModule,
  ReactiveFormsModule,
  FlexLayoutModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MatIconModule,
  MatDialogModule,
  MatSelectModule,
],
})
export class ProductModule {
}
