import {Component, Inject, Input, EventEmitter, OnInit, Output} from '@angular/core';
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
  editObj = {
    newSize: null,
    newQuantity: null
  };
  selectedQuantityArray = null;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<EditOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.name = (this.data && this.data.name) ? this.data.name : null;
    this.product = this.data.dialog_product;
    this.product.instances.forEach(el => this.sizesArray.push({value: el.size, name: el.size.toLocaleString('fa'), quantity: el.quantity}));
    this.editObj.newQuantity = this.product.quantity.value;
    this.editObj.newSize = this.product.size.value;
    this.sizesArray.forEach(el => {
        const tempObj: any = {
          qtyArray: [],
          size: null
        };
        for (let i = 1; i <= el.quantity; i++) {
          tempObj.qtyArray.push({
            value: i,
            name: i.toLocaleString('fa')
          });
        }
        tempObj.size = el;
        this.qtyArray.push(tempObj);
      }
    );

    this.selectedQuantityArray = this.qtyArray.find(el => el.size.value === this.product.size.value).qtyArray;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  applyEdit() {
    this.dialogRef.close(this.editObj);
  }

  setNewSize(newSize) {
    this.editObj.newSize = +newSize;
    this.product.quantity.value = null;
    this.selectedQuantityArray = this.qtyArray.find(el => el.size.value === +newSize).qtyArray;
  }

  setNewQty(newQty) {
    this.editObj.newQuantity = +newQty;
  }
}
