import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BidiModule} from '@angular/cdk/bidi';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatMenuModule, MatNativeDateModule, MatOptionModule, MatProgressBarModule, MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CollectionHeaderComponent} from './components/collection-header/collection-header.component';
import {FilteringPanelComponent} from './components/filtering-panel/filtering-panel.component';
import {FooterComponent} from './components/footer/footer.component';
import {GenDialogComponent} from './components/gen-dialog/gen-dialog.component';
import {MobileHeaderComponent} from './components/mobile-header/mobile-header.component';
import {ProductGridItemComponent} from './components/product-grid-item/product-grid-item.component';
import {SizeOptionsComponent} from './components/size-options/size-options.component';
import {SizePickerComponent} from './components/size-picker/size-picker.component';
import {SlidingHeaderComponent} from './components/sliding-header/sliding-header.component';
import {SuggestionComponent} from './components/suggestion/suggestion.component';
import {HeaderComponent} from './components/header/header.component';
import {RemovingConfirmComponent} from './components/removing-confirm/removing-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    // RouterModule,
    // FormsModule,
    // ReactiveFormsModule,
    // FlexLayoutModule,
    BidiModule,
    // MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    // MatInputModule,
    // MatMenuModule,
    // MatCheckboxModule,
    MatFormFieldModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatAutocompleteModule,
    // MatOptionModule,
    // HttpClientModule,
    // MatSnackBarModule,
    // MatProgressBarModule,
    MatIconModule,
  ],
  declarations: [
    // CollectionHeaderComponent,
    // FilteringPanelComponent,
    // FooterComponent,
    RemovingConfirmComponent,
    // HeaderComponent,
    // MobileHeaderComponent,
    // ProductGridItemComponent,
    // SizeOptionsComponent,
    // SizePickerComponent,
    // SlidingHeaderComponent,
    // SuggestionComponent
  ],
  entryComponents: [RemovingConfirmComponent],
  exports: [
    // HeaderComponent,
    RemovingConfirmComponent,
    // SuggestionComponent,
  ]
})
export class SharedModule { }
