import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-save-change-confirm',
  templateUrl: './save-change-confirm.component.html',
  styleUrls: ['./save-change-confirm.component.css']
})
export class SaveChangeConfirmComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SaveChangeConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  remove(answer) {
    this.dialogRef.close(answer);
  }
}
