import {Injectable} from '@angular/core';
import {BrowserWindowRef} from './window.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class PrintService {
  _window: any;

  constructor(private window: BrowserWindowRef, private snackBar: MatSnackBar) {
    this._window = window.nativeWindow;
  }

  printShelfCode(printvalue) {
    let popup = this._window.open('', '_blank',
      'width=840,height=1200,scrollbars=no,menubar=no,toolbar=no,'
      + 'location=no,status=no,titlebar=no');
    if (!popup) {
      this.snackBar.open('Print pop-up is blocked by browser. Enable pop-ups from this page.', null, {
        verticalPosition: 'top',
        duration: 4000,
      });
    } else {
      popup.window.focus();
      popup.document.write('<!DOCTYPE><html><head>'
        + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"  media="screen, print" />'
        + '</head><body><div style="text-align: center; height: 100%; font-size:400px;">'//onload="window.print()"
        + printvalue + '</div></body></html>');
      popup.document.close();
    }
  }
}
