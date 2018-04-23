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


  @Input() url: string;
  @Input() single = false;

  @Input()
  set additionalData(value) {
    this._additionalData = value;
  };

  _additionalData = {};
  @Output() OnCompleted = new EventEmitter<any[]>();

  private results: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.uploader = new FileUploader({url: 'api/' + this.url});
    this.enabled = true;

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const result = JSON.parse(response);
      this.results.push(result);
    };

    this.uploader.onCompleteAll = () => {
      if (Math.max(...this.results.map(el => Object.keys(el).length)) === 1)
        this.results = this.results.map(el => el.downloadURL);

      this.OnCompleted.emit(this.results);
      this.results = [];
    };

    this.uploader.onAfterAddingFile = () => {
      if (this.single) {
        if (this.uploader.queue.length > 1) {
          this.uploader.removeFromQueue(this.uploader.queue[0]);
        }
      }
    };

    this.uploader.onBuildItemForm = (fileItem, form) => {
      Object.keys(this._additionalData).forEach(e => {
        form.append(e, this._additionalData[e]);
      });
      return {fileItem, form};
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnDestroy() {
  }
}
