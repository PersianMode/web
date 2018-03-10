import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {
  name = null;
  product: any;
  qtyArray = [];
  sizesArray = [];
  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<EditOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    for (let i = 1; i < 11; i++)
      this.qtyArray.push(i.toLocaleString('fa'));
    this.name = (this.data && this.data.name) ? this.data.name : null;
    this.product = this.data.dialog_product;
    this.product.instances.forEach(el => this.sizesArray.push(el.size.toLocaleString('fa')));
  }
  remove(answer) {
    this.dialogRef.close(answer);
  }
}
