import {Component, Inject, Input, OnInit} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';


@Component({
  selector: 'app-order-lines',
  templateUrl: './order-lines.component.html',
  styleUrls: ['./order-lines.component.css']
})
export class OrderLinesComponent implements OnInit {
  orderInfo: any;
  orderLines = [];
  x;
  constructor(private profileOrderService: ProfileOrderService) { }

  ngOnInit() {
    this.orderInfo = this.profileOrderService.orderData;
    this.orderLines = this.orderInfo.dialog_order.order_lines;
  }
}



// import {Component, Inject, Input, OnInit} from '@angular/core';
// import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
//
//
// @Component({
//   selector: 'app-order-lines',
//   templateUrl: './order-lines.component.html',
//   styleUrls: ['./order-lines.component.css']
// })
// export class OrderLinesComponent implements OnInit {
//   orderInfo: any;
//   orderLines = [];
//   constructor(private profileOrderService: ProfileOrderService) { }
//
//   ngOnInit() {
//     console.log('here')
//     this.profileOrderService.orderData.subscribe( data => {
//       this.orderInfo = data;
//       console.log(data);
//       this.orderLines = this.orderInfo;
//     });
//   }
// }