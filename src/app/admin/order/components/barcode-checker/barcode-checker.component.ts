import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';

@Component({
  selector: 'app-barcode-checker',
  templateUrl: './barcode-checker.component.html',
  styleUrls: ['./barcode-checker.component.css']
})
export class BarcodeCheckerComponent implements OnInit {

  isOK: boolean;
  barcodeCtrl: FormControl;
  
  constructor(private dialogRef: MatDialogRef<BarcodeCheckerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {}



  ngOnInit() {

    
    this.barcodeCtrl = new FormControl();

    this.barcodeCtrl.valueChanges.debounceTime(150).subscribe(
      (res) => {

        this.isOK = res === this.data.barcode;
        if (this.isOK)
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 500);


      },
      (err) => {
      }
    );
  }

}
