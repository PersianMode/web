import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpService} from '../../services/http.service';

export interface LogoPos {
  width: number; // placeholder's width, not the image itself!
  height: number;
  top: number;
  right: number;
}
/*
* Default LogoPos:
*   width: 60
*   height: 29
*   top: 0
*   right: 0
* */

@Component({
  selector: 'app-logo-header',
  templateUrl: './logo-header.component.html',
  styleUrls: ['./logo-header.component.css']
})
export class LogoHeaderComponent implements OnInit {
  @Input() logos;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  getURL(path) {
    if (path) {
      if (path[0] !== '/')
        path = '/' + path;
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
    }
  }

}
