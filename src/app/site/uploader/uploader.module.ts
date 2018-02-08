import {NgModule} from '@angular/core';
import {UploaderRouting} from './uploader.routing';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {UploaderComponent} from './components/uploader/uploader.component';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  declarations: [
    UploaderComponent
  ],
  imports: [
    UploaderRouting,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    FileUploadModule,

  ],
})
export class UploaderModule {
}
