import {NgModule} from '@angular/core';
import {SuggestionComponent} from './components/suggestion/suggestion.component';
import {
  MatAutocompleteModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatMenuModule,
  MatOptionModule,
  MatToolbarModule
} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SearchFieldsComponent } from './components/search-fields/search-fields.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AbstractSearchComponent } from './components/abstract-search/abstract-search.component';
import {RemovingConfirmComponent} from './components/removing-confirm/removing-confirm.component';
import {BidiModule} from '@angular/cdk/bidi';

@NgModule({
  declarations: [
    // CollectionHeaderComponent,
    // FilteringPanelComponent,
    // FooterComponent,
    // GenDialogComponent,
    // HeaderComponent,
    // MobileHeaderComponent,
    // ProductGridItemComponent,
    // SizeOptionsComponent,
    // SlidingHeaderComponent,
    SearchFieldsComponent,
    SuggestionComponent,
    SearchFieldsComponent,
    AbstractSearchComponent,
    RemovingConfirmComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    BidiModule,
    MatIconModule,

  ],
  entryComponents: [RemovingConfirmComponent],
  exports: [SuggestionComponent,
    SearchFieldsComponent,
    RemovingConfirmComponent,
  ]
})
export class SharedModule {

}
