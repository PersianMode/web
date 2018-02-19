import {NgModule} from "@angular/core";
// import {CollectionHeaderComponent} from "./components/collection-header/collection-header.component";
// import {FilteringPanelComponent} from "./components/filtering-panel/filtering-panel.component";
// import {FooterComponent} from "./components/footer/footer.component";
// import {GenDialogComponent} from "./components/gen-dialog/gen-dialog.component";
// import {HeaderComponent} from "./components/header/header.component";
// import {MobileHeaderComponent} from "./components/mobile-header/mobile-header.component";
// import {ProductGridItemComponent} from "./components/product-grid-item/product-grid-item.component";
// import {SizeOptionsComponent} from "./components/size-options/size-options.component";
// import {SlidingHeaderComponent} from "./components/sliding-header/sliding-header.component";
import {SuggestionComponent} from "./components/suggestion/suggestion.component";
import {
  MatAutocompleteModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
  MatOptionModule,
  MatToolbarModule
} from "@angular/material";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SearchFieldsComponent } from './components/search-fields/search-fields.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import { AbstractSearchComponent } from './components/abstract-search/abstract-search.component';

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
  exports: [
    SuggestionComponent,
    SearchFieldsComponent,
    RemovingConfirmComponent,
  ]
})
export class SharedModule {

}
