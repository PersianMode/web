import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-delivery-cost',
  templateUrl: './delivery-cost.component.html',
  styleUrls: ['./delivery-cost.component.css']
})
export class DeliveryCostComponent implements OnInit {
  showTabs = false;
  loyaltyLabel;
  durationObject: any = {};

  constructor() {
  }

  ngOnInit() {
  }

  deliverySetting(eventObj) {
    if (eventObj) {
      if (eventObj._id && eventObj.name &&
        eventObj.delivery_days &&
        eventObj.cities && eventObj.delivery_loyalty) {
        this.showTabs = true;
      }
      // TODO : else case to notify compelete info for select duration (navigate to form)
      this.durationObject = {
        _id: eventObj._id,
        name: eventObj.name,
        delivery_days: eventObj.delivery_days,
        cities: eventObj.cities,
        delivery_loyalty: eventObj.delivery_loyalty,
      };
      this.loyaltyLabel = ' : ' + ' تحویل ' + this.durationObject.name;
    }
    else {
      this.durationObject = {};
      this.showTabs = false;
    }
  }
}
