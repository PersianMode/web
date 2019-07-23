import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ProductRouting} from './product.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductsComponent} from './products.component';
import {ProductBasicFormComponent} from './components/product-basic-form/product-basic-form.component';
import {ProductFullInfoComponent} from './components/product-full-info/product-full-info.component';
import {ProductColorComponent} from './components/product-color/product-color.component';
import {ProductInstanceComponent} from './components/product-instance/product-instance.component';
import {SharedModule} from '../../shared/shared.module';
import { ProductColorEditComponent } from './components/product-color-edit/product-color-edit.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductBasicFormComponent,
    ProductFullInfoComponent,
    ProductColorComponent,
    ProductInstanceComponent,
    ProductColorEditComponent,
    ProductColorEditComponent
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
    MatDividerModule
  ],
  entryComponents: [
    ProductColorEditComponent
  ]
})
export class ProductModule {
}
