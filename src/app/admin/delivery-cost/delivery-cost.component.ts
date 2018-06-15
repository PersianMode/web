import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-delivery-cost',
  templateUrl: './delivery-cost.component.html',
  styleUrls: ['./delivery-cost.component.css']
})
export class DeliveryCostComponent implements OnInit {
  showTabs = false;
  loyaltyLabel;
  durationObject: any = {};
  showDeliveryTab: boolean = false;
  showCAndCTab: boolean = false;
  _id;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this._id = params['id'] && params['id'] !== 'null' ? params['id'] : null;
        if (this._id) {
          // const item = data.filter(el => el._id === this._id);
          // if (item) this.changeDuration(item[0]);
          this.showDeliveryTab = true;
        }
      }
    );
  }

  deliverySetting(eventObj) {
    if (eventObj) {
      if (eventObj._id && eventObj.name &&
        eventObj.delivery_days &&
        eventObj.cities && eventObj.delivery_loyalty && (eventObj.is_c_and_c === false)) {
        this.showTabs = true;
      }
      // TODO : else case to notify compelete info for select duration (navigate to form)
      this.durationObject = {
        is_c_and_c: false,
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

  goToDeliveryTab() {
    this.showDeliveryTab = true;
    this.showCAndCTab = false;
  }

  goToCandCTab() {
    this.showDeliveryTab = false
    this.showCAndCTab = true;
  }
}
