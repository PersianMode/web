import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DialogEnum} from '../../enum/dialog.components.enum';

@Component({
  selector: 'app-gen-dialog',
  templateUrl: './gen-dialog.component.html',
  styleUrls: ['./gen-dialog.component.css']
})
export class GenDialogComponent implements OnInit {
  componentName = null;
  dialogEnum = DialogEnum;
  extraData: any = {};

  constructor(public dialogRef: MatDialogRef<GenDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.componentName = this.data.componentName;
    this.extraData = this.data.extraData ? this.data.extraData : {};
  }

  close(data) {
    this.dialogRef.close(data);
  }
}
