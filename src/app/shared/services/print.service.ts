import {Injectable} from '@angular/core';
import {BrowserWindowRef} from './window.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class PrintService {
  _window: any;

  constructor(private window: BrowserWindowRef, private snackBar: MatSnackBar) {
    this._window = window.nativeWindow;
  }

  printShelfCode(shelfCode) {
    let popup = this._window.open('', '_blank',
      'width=840,height=1200,scrollbars=no,menubar=no,toolbar=no,'
      + 'location=no,status=no,titlebar=no');
    if (!popup) {
      this.snackBar.open('صفحه ی popup در مرورگر بسته است . اجازه ی popup را بدهید و درخواست پرینت مجدد را کلیک نمایید', null, {
        direction: 'rtl',
        verticalPosition: 'top',
        duration: 4000,
      });
    } else {
      popup.window.focus();
      popup.document.write('<!DOCTYPE><html><head>'
        + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"  media="screen, print" />'
        + '</head><body onload="window.print()"><div style="text-align: center; height: 100%; font-size:400px;">'
        + shelfCode + '</div></body></html>');
      popup.document.close();
    }
  }

  dailySalesReportPrint(data) {
    let popup = this._window.open('', '_blank',
      'width=840,height=1200,scrollbars=no,menubar=no,toolbar=no,'
      + 'location=no,status=no,titlebar=no');
    if (!popup) {
      this.snackBar.open('صفحه ی popup در مرورگر بسته است . اجازه ی popup را بدهید و درخواست پرینت مجدد را کلیک نمایید', null, {
        direction: 'rtl',
        verticalPosition: 'top',
        duration: 4000,
      });
    } else {
      popup.window.focus();
      popup.document.write('<!DOCTYPE><html><head>'
        + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"  media="screen, print" />'
        + '</head><body onload="window.print()"><div style="text-align: right; height: 100%; font-size:14px;">'
        + data + '</div></body></html>');
      popup.document.close();
    }
  }

}
