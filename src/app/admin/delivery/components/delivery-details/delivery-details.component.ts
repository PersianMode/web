import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent implements OnInit {
  agentList = [];

  constructor(private dialogRef: MatDialogRef<DeliveryDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService) {}

  ngOnInit() {
    this.data = this.data.deliveryItem;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getFromAddress() {
    let address = '';

    if (Object.keys(this.data.return).length) {
      ['province', 'city', 'district', 'street', 'unit', 'no'].forEach(el => {
        address += this.data.from.customer[el] + ' - ';
      });
    } else {
      address = this.data.from.warehouse.address;
    }

    return address;
  }

  hasDeliveryAgent() {
    return Object.keys(this.data.delivery_agent).length;
  }
}
