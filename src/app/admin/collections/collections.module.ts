import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections.component';
import {CollectionsRouting} from './collections.routing';
import {
  MatAutocompleteModule,
  MatButtonModule, MatDialogModule, MatCardModule, MatGridListModule, MatIconModule,
  MatInputModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatCheckboxModule, MatFormFieldModule, MatTabsModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import { CollectionBasicFormComponent } from './components/collection-basic-form/collection-basic-form.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CollectionFullInfoComponent} from './components/collection-full-info/collection-full-info.component';
import {CollectionTypeComponent} from './components/collection-type/collection-type.component';
import {CollectionTagComponent} from './components/collection-tag/collection-tag.component';
import {CollectionProductComponent} from './components/collection-product/collection-product.component';
import { CollectionFilterOptionsComponent } from './components/collection-filter-options/collection-filter-options.component';

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
    CollectionProductComponent,
    CollectionFilterOptionsComponent,
  ]
})
export class CollectionsModule { }
