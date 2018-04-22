import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {EditOrderComponent} from '../../../cart/components/edit-order/edit-order.component';
import {MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-order-lines',
  templateUrl: './order-lines.component.html',
  styleUrls: ['./order-lines.component.css']
})
export class OrderLinesComponent implements OnInit {
  orderInfo: any;
  orderLines = [];
  statusText = 'درحال پردازش';
  noDuplicateOrderLine = [];
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(private profileOrderService: ProfileOrderService,
              private location: Location, private router: Router) {
  }

  ngOnInit() {
    this.orderInfo = this.profileOrderService.orderData;
    this.orderLines = this.orderInfo.dialog_order.order_lines;
    this.removeDuplicates(this.orderLines);
  }

  removeDuplicates(arr) {
    let instancArr = [];
    arr.forEach( el => {
      if (instancArr.indexOf(el.product_instance._id) === -1) {
        instancArr.push(el.product_instance._id);
        el.quantity = 1;
        this.noDuplicateOrderLine.push(el);
      }
      else {
        this.noDuplicateOrderLine.find(x => x.product_instance._id === el.product_instance._id).quantity++;
      }
    });
  }

  onClose() {
    // TODO: guard is needed if any fields have been changed!
    if (this.isNotMobile) {
      this.closeDialog.emit(false);
    } else {
      this.location.back();
    }
  }

  navigateToProduct(product_id, color_id) {
    this.router.navigate(['/product', product_id, color_id]);
    this.closeDialog.emit(false);
  }

  makePersianNumber(a: string, isPrice) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: isPrice});
  }

  orderStatus(orderLine) {
    let tickets = [];

    tickets = orderLine.tickets;
    switch (tickets[0].status) {
      case 1:
        this.statusText = 'درحال پردازش'
        break;
      case 2:
        this.statusText = 'تحویل شده'
        break;
      default:
        this.statusText = 'درحال پردازش'

      return this.statusText;
    }
  }
}
