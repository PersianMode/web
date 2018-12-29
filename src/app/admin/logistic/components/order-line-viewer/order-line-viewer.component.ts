import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-order-line-viewer',
  templateUrl: './order-line-viewer.component.html',
  styleUrls: ['./order-line-viewer.component.css']
})
export class OrderLineViewerComponent implements OnInit {

  constructor(private  dialogRef: MatDialogRef<OrderLineViewerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
