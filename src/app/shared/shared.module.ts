import {NgModule} from '@angular/core';
import {SuggestionComponent} from './components/suggestion/suggestion.component';
import {
  MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatOptionModule, MatRadioModule, MatSelectModule, MatStepperModule,
  MatToolbarModule, MatSnackBarModule, MatSlideToggleModule, MatButtonToggleModule, MatProgressSpinnerModule
} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchFieldsComponent} from './components/search-fields/search-fields.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AbstractSearchComponent} from './components/abstract-search/abstract-search.component';
import {RemovingConfirmComponent} from './components/removing-confirm/removing-confirm.component';
import {BidiModule} from '@angular/cdk/bidi';
import {PanelsComponent} from './components/panels/panels.component';
import {RouterModule} from '@angular/router';
import {UploaderComponent} from './components/uploader/uploader.component';
import {FileUploadModule} from 'ng2-file-upload';
import {AgmCoreModule} from '@agm/core';
import {AddressTableComponent} from './components/address-table/address-table.component';
import {DobComponent} from './components/dob/dob.component';
import {DragulaModule} from 'ng2-dragula';
import {LogoHeaderComponent} from './components/logo-header/logo-header.component';
import {SizePickerComponent} from './components/size-picker/size-picker.component';
import { SaveChangeConfirmComponent } from './components/save-change-confirm/save-change-confirm.component';
import { ShelfCodePrinterComponent } from './components/shelf-code-printer/shelf-code-printer.component';
import {ProductService} from './services/product.service';
import {AuthGuard} from '../site/auth.guard';
import {SpinnerService} from './services/spinner.service';
import { BankRefundFormComponent } from './components/bank-refund-form/bank-refund-form.component';

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
    LogoHeaderComponent,
    SizePickerComponent,
    SaveChangeConfirmComponent,
    ShelfCodePrinterComponent,
    BankRefundFormComponent,
  ],
  imports: [
    MatSlideToggleModule,
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
    BidiModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    FileUploadModule,
    MatStepperModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDtglbLDTFZFa1rE-glHm7bFxnp9iANHro'
    }),
    DragulaModule,
  ],
  entryComponents: [
    RemovingConfirmComponent,
    SaveChangeConfirmComponent,
    BankRefundFormComponent
  ],
  exports: [SuggestionComponent,
    SearchFieldsComponent,
    ShelfCodePrinterComponent,
    RemovingConfirmComponent,
    SaveChangeConfirmComponent,
    PanelsComponent,
    UploaderComponent,
    AddressTableComponent,
    DobComponent, MatSlideToggleModule,
    LogoHeaderComponent,
    SizePickerComponent,
    BankRefundFormComponent
  ],
})
export class SharedModule {

}
