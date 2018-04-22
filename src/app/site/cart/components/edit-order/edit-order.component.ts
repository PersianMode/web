import {Component, Inject, Input, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Router} from '@angular/router';

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

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<EditOrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,  private router: Router) {
  }

  ngOnInit() {
    this.product = this.data.dialog_product;
    this.product.instances.forEach(el => {
      if (el.quantity) {
        const sizeFirstCharCode = el.size.charCodeAt(0);
        this.sizesArray.push({
          value: el.size,
          name: (sizeFirstCharCode >= 48 && sizeFirstCharCode <= 57) ? el.size.toLocaleString('fa') : el.size,
          quantity: el.quantity
        });
      };
      this.editObj.newQuantity = this.product.quantity;
    });

    this.sizesArray = Array.from(new Set(this.sizesArray));

    this.sizesArray.forEach(el => {
        const tempObj: any = {
          qtyArray: [],
          size: el
        };
        for (let i = 1; i <= el.quantity; i++) {
          tempObj.qtyArray.push({
            value: i,
            name: i.toLocaleString('fa')
          });
        }
        this.qtyArray.push(tempObj);
      }
    );

    const tempObj = this.qtyArray.find(el => el.size.value === this.product.size);
    this.selectedQuantityArray = tempObj ? tempObj.qtyArray : null;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  applyEdit() {
    this.dialogRef.close(this.editObj);
  }

  setNewSize(newSize) {
    this.editObj.newSize = newSize;
    this.selectedQuantityArray = this.qtyArray.find(el => el.size.value === this.editObj.newSize).qtyArray;
  }

  setNewQty(newQty) {
    this.editObj.newQuantity = +newQty;
  }

  navigateToProduct() {
    this.router.navigate(['product', this.product.product_id, this.product.color.id]);
    this.dialogRef.close();
  }
}
