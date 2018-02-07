import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatNativeDateModule, MatSelectModule,
  MatSnackBarModule, MatTabsModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ProductRouting} from './product.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AllProductsComponent} from './all-products.component';
import {ProductBasicFormComponent} from './components/product-basic-form/product-basic-form.component';
import {ProductViewComponent} from './components/product-view/product-view.component';
import { ProductFullInfoComponent } from './components/product-full-info/product-full-info.component';
import { ProductColorComponent } from './components/product-color/product-color.component';
import { ProductSizeComponent } from './components/product-size/product-size.component';


@NgModule({
  declarations: [
    AllProductsComponent,
    ProductBasicFormComponent,
    ProductViewComponent,
    ProductFullInfoComponent,
    ProductColorComponent,
    ProductSizeComponent,
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
  MatTabsModule,
],
})
export class ProductModule {
}
