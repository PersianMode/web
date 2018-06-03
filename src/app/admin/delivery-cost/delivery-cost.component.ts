import { Component, OnInit, Input } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

  deliverySettingBaseOnDuration($event) {
    this.cityArray = [];
    if ($event.name && $event.value)
      this.showSettingTabs = true;
    this.durationObject = {
      name: $event.name,
      value: $event.value
    };
    this.cityLabel = ' : ' + 'شهرهای قابل انتخاب برای تحویل ' + this.durationObject.name ;
    this.costLabel = ' : ' + 'هزینه ارسال به تفکیک شهر برای تحویل ' + this.durationObject.name ;
    this.loyaltyLabel = ' : ' + 'درصد تخفیف به تفکیک امتیاز وفاداری برای تحویل ' + this.durationObject.name ;

  }

  addCityToArray($event) {
    this.cityArray = this.cityArray.slice().concat([$event]);
  }

  submitTotalInfo() {
  }

}
