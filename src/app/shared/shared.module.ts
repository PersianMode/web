import {NgModule} from '@angular/core';
import {SuggestionComponent} from './components/suggestion/suggestion.component';
import {
  MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatOptionModule, MatRadioModule, MatSelectModule, MatStepperModule,
  MatToolbarModule, MatSnackBarModule,
} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SearchFieldsComponent } from './components/search-fields/search-fields.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AbstractSearchComponent } from './components/abstract-search/abstract-search.component';
import {RemovingConfirmComponent} from './components/removing-confirm/removing-confirm.component';
import {BidiModule} from '@angular/cdk/bidi';
import {PanelsComponent} from './components/panels/panels.component';
import {RouterModule} from '@angular/router';
import {UploaderComponent} from './components/uploader/uploader.component';
import {FileUploadModule} from 'ng2-file-upload';
import {AgmCoreModule} from '@agm/core';
import {AddressTableComponent} from './components/address-table/address-table.component';
import { DobComponent } from './components/dob/dob.component';
import {DragulaModule} from 'ng2-dragula';

@NgModule({
  declarations: [
    SearchFieldsComponent,
    SuggestionComponent,
    SearchFieldsComponent,
    AbstractSearchComponent,
    RemovingConfirmComponent,
    PanelsComponent,
    UploaderComponent,
    AddressTableComponent,
    DobComponent,
],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatRadioModule,
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
    MatRadioModule,
    BidiModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    FileUploadModule,
    MatStepperModule,
    MatSnackBarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtglbLDTFZFa1rE-glHm7bFxnp9iANHro'
    }),
    DragulaModule,
  ],
  entryComponents: [
    RemovingConfirmComponent,
  ],
  exports: [SuggestionComponent,
    SearchFieldsComponent,
    RemovingConfirmComponent,
    PanelsComponent,
    UploaderComponent,
    AddressTableComponent,
    DobComponent,
  ]
})
export class SharedModule {

}
