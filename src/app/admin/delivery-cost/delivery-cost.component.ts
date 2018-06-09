import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-delivery-cost',
  templateUrl: './delivery-cost.component.html',
  styleUrls: ['./delivery-cost.component.css']
})
export class DeliveryCostComponent implements OnInit {

  showSettingTabs = false;
  durationObject: any = {};
  cityArray = [];
  cityLabel;
  costLabel;
  loyaltyLabel;

  constructor() {
  }

  ngOnInit() {
  }

  deliverySettingBaseOnDuration(eventObj) {
    this.cityArray = [];
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
    this.cityLabel = ' : ' + 'شهرهای قابل انتخاب برای تحویل ' + this.durationObject.name;
    this.costLabel = ' : ' + 'هزینه ارسال به تفکیک شهر برای تحویل ' + this.durationObject.name;
    this.loyaltyLabel = ' : ' + 'درصد تخفیف به تفکیک امتیاز وفاداری برای تحویل ' + this.durationObject.name;
  }

  addCityToArray($event) {
    this.cityArray = this.cityArray.slice().concat([$event]);
  }

  submitTotalInfo() {
  }

}
