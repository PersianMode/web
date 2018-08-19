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

  @Input() additionalData = {};
  @Output() OnCompleted = new EventEmitter<any>();

  private results: any = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url && changes.url.currentValue) {
      this.uploader = new FileUploader({url: 'api/' + this.url});
      this.setEvents();
    }
  }

  setEvents() {
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const result = JSON.parse(response);
      if (result)
        this.results.push(result);

    };

    this.uploader.onCompleteAll = () => {
      if (Math.max(...this.results.map(el => Object.keys(el).length)) === 1)
        this.results = this.results.map(el => el.downloadURL);

      // Note: if it was 'single', the output is an array with one element, not only the element itself!
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
      Object.keys(this.additionalData)
        .forEach(e => form.append(e, this.additionalData[e]));
      return {fileItem, form};
    };
  }

  constructor() {
  }

  ngOnInit(): void {
    this.uploader = new FileUploader({url: 'api/' + this.url});
    this.enabled = true;
    this.setEvents();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnDestroy() {
  }
}
