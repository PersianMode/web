import {Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpService} from 'app/shared/services/http.service';

@Component({
  selector: 'app-delivery-tracking',
  templateUrl: './delivery-tracking.component.html',
  styleUrls: ['./delivery-tracking.component.css']
})
export class DeliveryTrackingComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeliveryTrackingComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.data = this.data.deliveryItem;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getStatus(value) {
    // return OrderStatus.find(s => s.status === value.status).name;
  }

  getDate(value) {
    return value.timestamp ? moment(value.timestamp).format('YYYY-MM-DD') : 'نامشخص';
  }

  getTime(value) {
    return value.timestamp ? moment(value.timestamp).format('HH:mm:ss') : 'نامشخص';
  }

  isOnDelivery() {
    const statusObj = this.data.status_list.find(el => !el.is_processed);
    // return statusObj && statusObj.status === STATUS.OnDelivery;
  }

  getImageUrl(url) {
    if (url) {
      url = url[0] === '/' ? url : '/' + url;
      return this.sanitizer.bypassSecurityTrustResourceUrl(HttpService.Host + url);
    }
  }
}
