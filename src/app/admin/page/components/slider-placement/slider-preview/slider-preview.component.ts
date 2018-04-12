import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../../../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';

export interface Pos {
  // imgHeight: Number;
  imgWidth: Number;
  imgMarginTop: Number;
  // margin_bottom: Number;
  imgMarginLeft: Number;
}

@Component({
  selector: 'app-slider-preview',
  templateUrl: './slider-preview.component.html',
  styleUrls: ['./slider-preview.component.css']
})
export class SliderPreviewComponent implements OnInit {
  @Input()
  set text(value) {
    this._text = value;
  }

  @Input()
  set pos(value: Pos) {
    this._pos = value;
  }

  @Input()
  set image(value) {
    this._image = value;
  }

  _text;
  _pos: Pos;
  _image;
  slide;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.slide = this._pos;
  }

  // change($event) {
  //   console.log('changed!', $event, this._pos.imgWidth);
  // }

  getURL(path) {
    if (path)
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }

}
