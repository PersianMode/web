import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpService} from '../../services/http.service';

export interface LogoPos {
  width: number; // placeholder's width, not the image itself!
  height: number;
  top: number;
  right: number;
}

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
    // TODO: Test-Purpose-Only!
    return `assets/logos/${path}`;
    // if (path)
    //   return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + path);
  }

}
