import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';

@Component({
  selector: 'app-order-line-viewer',
  templateUrl: './order-line-viewer.component.html',
  styleUrls: ['./order-line-viewer.component.css']
})
export class OrderLineViewerComponent implements OnInit {

  constructor(private dialog: MatDialog, private  dialogRef: MatDialogRef<OrderLineViewerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  getProductDetail(orderLine) {
    const product_color = orderLine.product_colors.find(x => x._id === orderLine.instance.product_color_id);
    const thumbnailURL = (product_color && product_color.image && product_color.image.thumbnail) ?
      imagePathFixer(product_color.image.thumbnail, orderLine.instance.product_id, product_color._id) :
      null;
    return {
      name: orderLine.instance.product_name,
      thumbnailURL,
      color: product_color ? product_color.name : null,
      color_code: product_color ? product_color.code : null,
      size: orderLine.instance.size,
      product_id: orderLine.instance.product_id
    };
  }

  showDetail(orderLine) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLine)
    });
  }


  close() {
    this.dialogRef.close();
  }
}
