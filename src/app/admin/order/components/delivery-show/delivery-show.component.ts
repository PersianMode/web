import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpService } from 'app/shared/services/http.service';

@Component({
  selector: 'app-delivery-show',
  templateUrl: './delivery-show.component.html',
  styleUrls: ['./delivery-show.component.css']
})
export class DeliveryShowComponent implements OnInit {

  orderId;
  orderLineId;
  constructor(private httpService: HttpService , public dialogRef: MatDialogRef<DeliveryShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    console.log('this.data', this.data);
    this.orderId = this.data.orderId;
    this.orderLineId = this.data.orderLineId;
    this.httpService.post(`delivery/by_order`, {orderId: this.orderId, orderLineId: this.orderLineId}).subscribe(res => {
      console.log('result-->', res);
    });
  }

}
