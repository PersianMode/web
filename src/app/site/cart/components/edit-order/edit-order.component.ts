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
  product: any = {
    product_id : 0,
    instance_id: 14,
    name: 'رونالدینیو دیوید بکهام کایری ۳ مدل What The',
    tags: ['کفش', 'بسکتبال', 'نوجوانان'],
    price: 599000,
    size: 6.5,
    quantity : 3,
    color : {
      color_id : 101,
      name: 'طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی'
    },
    thumbnail : '13.jpg',
    discount : '',
    instances : [{
      instance_id : 14,
      size : 6.5,
      quantity : [7],
      discount : ''
    }, {
      instance_id : 15,
      size : 7,
      quantity : [5],
      discount : ''
    }, {
      instance_id : 16,
      size : 8,
      qantity : [7],
      discount : ''
    }]
  };
  total_price = null;
  qtyArray = [];
  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<EditOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    for (let i = 1; i < 10; i++)
      this.qtyArray.push(i);
    console.log('recieved data :  ', this.data.dialog_product);
    this.name = (this.data && this.data.name) ? this.data.name : null;
    this.total_price = this.product.quantity * this.product.price;
    this.total_price = priceFormatter(this.total_price);
    this.product.price = priceFormatter(this.product.price);
    this.product.size = this.product.size.toLocaleString('fa');
    this.product.quantity = this.product.quantity.toLocaleString('fa');
  }
  remove(answer) {
    this.dialogRef.close(answer);
  }
}
