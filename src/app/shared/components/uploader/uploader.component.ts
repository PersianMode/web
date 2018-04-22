import {Component, OnInit, OnDestroy, EventEmitter, Output, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit, OnChanges, OnDestroy {

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
  @Output() OnCompleted = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {

    this.uploader = new FileUploader({url: 'api/' + this.url});

    this.enabled = true;

    this.setEvents();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && changes.url.currentValue) {
      this.uploader = new FileUploader({url: 'api/' + this.url});
      this.setEvents();
    }

  }

  setEvents() {

    let results: string[] = [];
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const result = JSON.parse(response);
      if (result)
        results.push(result);

    };

    this.uploader.onCompleteAll = () => {
      this.OnCompleted.emit(this.single ? results[0] : results);
      results = [];
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
