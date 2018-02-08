import {Component, OnInit, OnDestroy, EventEmitter, Output, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit, OnDestroy {

  public uploader: FileUploader;
  public hasBaseDropZoneOver = true;
  enabled = false;


  @Input() personnel_id;
  @Output() new_upload_code = new EventEmitter<number>();

  constructor() {
  }



  ngOnInit(): void {


    this.uploader = new FileUploader({url: `api/product/image/5a7ae328d5dfe636e01c97f8/5a7c0a9a9a8c9b259c7e91e7`});

    this.enabled = true;

    this.uploader.onSuccessItem = (item, response, status, headers) => {

    };

    this.uploader.onCompleteAll = () => {

      const newCode = Math.round(Math.random() * 10000);

      this.new_upload_code.emit(newCode);

    };


  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnDestroy() {
  }
}
