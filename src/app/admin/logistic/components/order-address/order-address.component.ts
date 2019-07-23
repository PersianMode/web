import {Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-address',
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.css']
})
export class OrderAddressComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<OrderAddressComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }


}
