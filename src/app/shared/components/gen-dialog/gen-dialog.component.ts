import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogEnum} from '../../enum/dialog.components.enum';
import {ProfileOrderService} from '../../services/profile-order.service';

@Component({
  selector: 'app-gen-dialog',
  templateUrl: './gen-dialog.component.html',
  styleUrls: ['./gen-dialog.component.css']
})
export class GenDialogComponent implements OnInit {
  componentName = null;
  dialogEnum = DialogEnum;
  extraData = {};

  constructor(public dialogRef: MatDialogRef<GenDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.componentName = this.data.componentName;
    this.extraData = this.data.extraData ? this.data.extraData : {};
  }

  close() {
    this.dialogRef.close();
  }
}
