import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from 'app/shared/services/auth.service';
import {AccessLevel} from 'app/shared/enum/accessLevel.enum';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  @Output() OnUnassignedInternalDeliveryCount = new EventEmitter();
  isSalesManager: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const userDetails = this.authService.userDetails;
    if (userDetails.access_level === AccessLevel.SalesManager) {
      this.isSalesManager = true;
    }
  }

  OnUnassignedDeliveryChanged($event) {
    this.OnUnassignedInternalDeliveryCount.emit($event);
  }


}
