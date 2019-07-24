import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {DeliveryShelfCodeComponent} from '../delivery-shelf-code/delivery-shelf-code.component';
import {AuthService} from '../../../../shared/services/auth.service';
import {ScanTrigger} from 'app/shared/enum/scanTrigger.enum';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-barcode-checker',
  templateUrl: './barcode-checker.component.html',
  styleUrls: ['./barcode-checker.component.css']
})
export class BarcodeCheckerComponent implements OnInit {

  barcodeCtrl: FormControl;
  currentWarehouse: string;


  isHub = false;
  _trigger: number;

  @Input()
  set trigger(value: number) {
    this._trigger = value;
  }

  @Input() extra: any;

  @Output() onMismatchListener = new EventEmitter();

  constructor(private httpService: HttpService,
    private snackBar: MatSnackBar,
    private progressService: ProgressService,
    private dialog: MatDialog,
    private authService: AuthService) {}


  ngOnInit() {

    this.isHub = this.authService.userDetails.warehouse_id === this.authService.warehouses.find(x => x.is_hub)._id;

    this.barcodeCtrl = new FormControl();
    this.barcodeCtrl.valueChanges.pipe(debounceTime(150)).subscribe(
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
    if (!this._trigger) {
      this.openSnackBar('نوع اسکن مشخص نیست');
      return;
    }
    this.progressService.enable();

    let body = {
      barcode,
      trigger: this._trigger
    };

    if (this.extra)
      body = Object.assign(body, this.extra);

    this.httpService.post('order/ticket/scan', body).subscribe(res => {
      this.progressService.disable();

      if (this.isHub && this._trigger === ScanTrigger.Inbox)
        this.dialog.open(DeliveryShelfCodeComponent, {
          width: '400px',
          disableClose: !(res && res.exist),
          data: res
        });
    }, err => {
      console.log('-> ', err);
      this.progressService.disable();
      this.openSnackBar('خطا به هنگام اسکن محصول')
    });


  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }


}
