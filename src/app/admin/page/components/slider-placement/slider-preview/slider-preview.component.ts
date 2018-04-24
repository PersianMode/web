import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpService} from '../../../../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';

export interface Pos {
  imgWidth: number;
  imgMarginTop: number;
  imgMarginLeft: number;
}

@Component({
  selector: 'app-slider-preview',
  templateUrl: './slider-preview.component.html',
  styleUrls: ['./slider-preview.component.css']
})
export class SliderPreviewComponent {
  @Input()
  set text(value) {
    this._text = value;
  }

  @Input()
  set pos(value: Pos) {
    this._pos = value;
    this.slide = Object.assign({}, this._pos);
  }

  @Input()
  set image(value) {
    this._image = value;
  }

  @Output() imageSettingsChanged = new EventEmitter<any>();

  _text;
  _pos: Pos;
  _image;
  slide: Pos;
  anyChanges = false;

  constructor(private sanitizer: DomSanitizer) {
  }

  change($event) {
    this.changeFields();
  }

  changeMargin(axis, value) {
    this.slide[axis] += value;
    this.changeFields();
  }

  changeFields() {
    const widthChange = this._pos['imgWidth'] === this.slide['imgWidth'];
    const marginLeftChange = this._pos['imgMarginTop'] === this.slide['imgMarginTop'];
    const marginTopChange = this._pos['imgMarginLeft'] === this.slide['imgMarginLeft'];

    this.anyChanges = !(widthChange && marginLeftChange && marginTopChange);

    this.imageSettingsChanged.emit({
      anyChanges: this.anyChanges,
      newStyle: this.slide,
    });
  }

  getURL(path) {
    if (path) {
      if (path[0] !== '/')
        path = '/' + path;
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
    }
  }

}
