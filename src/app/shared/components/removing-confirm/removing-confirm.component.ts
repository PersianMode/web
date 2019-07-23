import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-removing-confirm',
  templateUrl: './removing-confirm.component.html',
  styleUrls: ['./removing-confirm.component.css']
})
export class RemovingConfirmComponent implements OnInit {
  name = null;
  message = null;

  constructor(public dialogRef: MatDialogRef<RemovingConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.name = (this.data && this.data.name) ? this.data.name : null;
    this.message = (this.data && this.data.message) ? this.data.message : null;
  }

  remove(answer) {
    this.dialogRef.close(answer);
  }
}
