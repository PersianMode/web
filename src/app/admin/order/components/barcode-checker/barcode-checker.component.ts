import {Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';

@Component({
  selector: 'app-barcode-checker',
  templateUrl: './barcode-checker.component.html',
  styleUrls: ['./barcode-checker.component.css']
})
export class BarcodeCheckerComponent implements OnInit {

  barcodeCtrl: FormControl;

  

  constructor(private httpService: HttpService,
    private snackBar: MatSnackBar,
    private progressService: ProgressService) {}


  ngOnInit() {


    this.barcodeCtrl = new FormControl();

    this.barcodeCtrl.valueChanges.debounceTime(150).subscribe(
      (res) => {
        if (res) {
          this.checkBarcode(res.trim());
          this.barcodeCtrl.setValue('');
        }
      },
      (err) => {
      }
    );
  }
  checkBarcode(barcode) {
    this.progressService.enable();
    this.httpService.post('order/ticket/scan', {
      barcode
    }).subscribe(res => {

      this.progressService.disable();
      console.log('-> ', res);
    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا به هنگام اسکن محصول')
    })


  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

}

