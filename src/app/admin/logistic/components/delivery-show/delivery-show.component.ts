
import {map} from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'app/shared/services/http.service';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-delivery-show',
  templateUrl: './delivery-show.component.html',
  styleUrls: ['./delivery-show.component.css']
})
export class DeliveryShowComponent implements OnInit {

  orderId;
  orderLineId;
  from;
  to;
  agentName;
  deliveryStart;
  deliveryEnd;
  start;
  end;
  constructor(private httpService: HttpService , public dialogRef: MatDialogRef<DeliveryShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    console.log('this.data', this.data);
    this.orderId = this.data.orderId;
    this.orderLineId = this.data.orderLineId;
    this.httpService.post(`delivery/by_order`, {orderId: this.orderId, orderLineId: this.orderLineId}).pipe(
      map(res => res[0]))
      .subscribe(data => {
      console.log('data-->', data);
      
      this.from = data.from['customer']['_id'] ? data.from['customer'] : data.from['warehouse'];
      this.to = data.to['customer']['_d'] ? data.to['customer'] : data.to['warehouse'];
      this.agentName = data['agent_name'] ? data['agent_name'] : null;
      this.deliveryStart = data['delivery_start'] ? moment(data['delivery_start']).format('jYYYY/jMM/jDD HH:mm:ss') : null;
      this.deliveryEnd = data['delivery_end'] ? moment(data['delivery_end']).format('jYYYY/jMM/jDD HH:mm:ss') : null;
      this.start = data['start'] ?  moment(data['start']).format('jYYYY/jMM/jDD HH:mm:ss') : null;
      this.end = data['end'] ?  moment(data['end']).format('jYYYY/jMM/jDD HH:mm:ss') : null;
    });
  }

}
