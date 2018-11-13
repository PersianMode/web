import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-mismatch-confirm',
  templateUrl: './mismatch-confirm.component.html',
  styleUrls: ['./mismatch-confirm.component.css']
})
export class MismatchConfirmComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MismatchConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }
  close(state) {
    this.dialogRef.close(state);
  }
}
