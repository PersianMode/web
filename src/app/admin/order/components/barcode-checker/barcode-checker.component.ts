import {Component, OnInit, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSnackBar, MatDialog} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {DeliveryShelfCodeComponent} from '../delivery-shelf-code/delivery-shelf-code.component';
import {AuthService} from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-barcode-checker',
  templateUrl: './barcode-checker.component.html',
  styleUrls: ['./barcode-checker.component.css']
})
export class BarcodeCheckerComponent implements OnInit {

  barcodeCtrl: FormControl;
  isStarted = false;

  currentWarehouse: String;


  @Input() isHub = false;
  @Input() finished = true;

  constructor(private httpService: HttpService,
    private snackBar: MatSnackBar,
    private progressService: ProgressService,
    private dialog: MatDialog,
    private authService: AuthService) {}


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

      if (this.isHub)
        this.dialog.open(DeliveryShelfCodeComponent, {
          width: '400px',
          disableClose: !(res && res.exist),
          data: res
        });
      console.log('-> ', res);
    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا به هنگام اسکن محصول')
    });


  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }


  onWarehouseChange(warehouseId) {
    this.currentWarehouse = warehouseId;
  }

  getClerkWarehouses(isHub = false) {
    return this.authService.warehouses
      .filter(x => x.is_hub === isHub)
      .sort((a, b) => a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0);
  }

}

