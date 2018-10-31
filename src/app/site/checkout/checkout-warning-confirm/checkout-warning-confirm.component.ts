import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-checkout-warning-confirm',
  templateUrl: './checkout-warning-confirm.component.html',
  styleUrls: ['./checkout-warning-confirm.component.css']
})
export class CheckoutWarningConfirmComponent implements OnInit {

  haveError = false;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<CheckoutWarningConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
  }

  ngOnInit() {
    this.haveError = this.data.isError;
  }

  rejectOrCloseWarning() {
    this.dialogRef.close(false);
  }

  acceptWarning() {
    this.dialogRef.close(true);
  }
}

