import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule,
  MatPaginatorModule, MatSelectModule,
  MatSnackBarModule, MatTabsModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ProductRouting} from './product.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductsComponent} from './products.component';
import {ProductBasicFormComponent} from './components/product-basic-form/product-basic-form.component';
import {ProductFullInfoComponent} from './components/product-full-info/product-full-info.component';
import {ProductColorComponent} from './components/product-color/product-color.component';
import {ProductInstanceComponent} from './components/product-instance/product-instance.component';
import {SharedModule} from '../../shared/shared.module';
// import {ProductTagComponent} from './components/product-tag/product-tag.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductBasicFormComponent,
    ProductFullInfoComponent,
    ProductColorComponent,
    ProductInstanceComponent,
    ProductTagComponent,
  ],
  imports: [
    ProductRouting,
    SharedModule,
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
    MatCheckboxModule,
    MatPaginatorModule,
    SharedModule,
    MatCheckboxModule,
  ],
})
export class ProductModule {
}
