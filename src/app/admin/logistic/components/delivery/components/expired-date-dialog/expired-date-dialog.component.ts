import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-expired-date-dialog',
  templateUrl: './expired-date-dialog.component.html',
  styleUrls: ['./expired-date-dialog.component.css']
})
export class ExpiredDateDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ExpiredDateDialogComponent>) { }

  ngOnInit() {
  }

  accept(value) {
    this.dialogRef.close(value);
  }
}
