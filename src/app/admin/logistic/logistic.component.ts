import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../shared/services/title.service';
import {AuthService} from '../../shared/services/auth.service';
import {AccessLevel} from 'app/shared/enum/accessLevel.enum';

@Component({
  selector: 'app-logistic',
  templateUrl: './logistic.component.html',
  styleUrls: ['./logistic.component.css']
})

export class LogisticComponent implements OnInit {


  InboxCount: number;
  UnassignedInternalDeliveryCount: number;
  InternalDeliveryBoxCount: number;
  ExternalDeliveryBoxCount: number;
  ReturnDeliveryBoxCount: number;

  isSalesManager = false;
  isHubClerk = false;
  isShopClerk = false;

  constructor(private titleService: TitleService, private authService: AuthService) {
  }

  ngOnInit() {

    const userDetails = this.authService.userDetails;
    if (userDetails.access_level === AccessLevel.SalesManager) {
      this.isSalesManager = true;
    }
    if (userDetails.access_level === AccessLevel.ShopClerk) {
      const foundWarehouse = this.authService.warehouses.find(x => x._id === userDetails.warehouse_id);
      this.isShopClerk = foundWarehouse.has_customer_pickup;
    }
    if (userDetails.access_level === AccessLevel.HubClerk) {
      this.isHubClerk = true;
    }

    this.titleService.setTitleWithOutConstant('ادمین: سفارش‌ها');
  }


}
