import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections.component';
import {CollectionsRouting} from './collections.routing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {FlexLayoutModule} from '@angular/flex-layout';
import { CollectionBasicFormComponent } from './components/collection-basic-form/collection-basic-form.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CollectionFullInfoComponent} from './components/collection-full-info/collection-full-info.component';
import {CollectionTypeComponent} from './components/collection-type/collection-type.component';
import {CollectionTagComponent} from './components/collection-tag/collection-tag.component';
import {CollectionProductComponent} from './components/collection-product/collection-product.component';

@NgModule({
  imports: [
    CommonModule,
    CollectionsRouting,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    SharedModule,
  ],
  declarations: [
    CollectionsComponent,
    CollectionFullInfoComponent,
    CollectionBasicFormComponent,
    CollectionTypeComponent,
    CollectionTagComponent,
    CollectionProductComponent
  ]
})
export class CollectionsModule { }
