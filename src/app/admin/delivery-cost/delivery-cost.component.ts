import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-delivery-cost',
  templateUrl: './delivery-cost.component.html',
  styleUrls: ['./delivery-cost.component.css']
})
export class DeliveryCostComponent implements OnInit {

  showSettingTabs = false;
  durationObject: any = {};
  loyaltyLabel;

  constructor() {
  }

  ngOnInit() {
  }

  deliverySettingBaseOnDuration(eventObj) {
    if (eventObj.duration_id && eventObj.name &&
      eventObj.duration_value &&
      eventObj.duration_cities && eventObj.duration_loyalty_info ) {
        this.showSettingTabs = true;
    }
    this.durationObject = {
      duration_id: eventObj.duration_id,
      name: eventObj.name,
      duration_value: eventObj.duration_value,
      duration_cities: eventObj.duration_cities,
    };
    this.loyaltyLabel = ' : ' + ' تحویل ' + this.durationObject.name;
  }

  submitTotalInfo() {
  }

}
