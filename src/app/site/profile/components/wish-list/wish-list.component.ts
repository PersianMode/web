import { Component, OnInit } from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {dateFormatter} from '../../../../shared/lib/dateFormatter';
import {MatDialog} from '@angular/material';
import {ResponsiveService} from '../../../../shared/services/responsive.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  displayedColumns = ['col_no', 'thumbnail', 'date', 'name', 'size', 'delete'];
  profileWishList = [];
  isMobile = false;

  constructor(private profileOrderService: ProfileOrderService, private router: Router,
              private responsiveService: ResponsiveService,
              private dialog: MatDialog, protected httpService: HttpService,
              protected progressService: ProgressService) {
    this.isMobile = this.responsiveService.isMobile;
  }
  ngOnInit() {
    this.profileOrderService.wishListArray.subscribe( result => {
      if (!result.length)
        return;
      else {
        this.profileWishList = result;
        this.profileWishList.forEach(el => [el.jalali_date, el.time] = dateFormatter(el.wish_list.adding_time));
      }
    });
    this.profileOrderService.getWishList();
    this.responsiveService.switch$.subscribe( isMobile => this.isMobile = isMobile);
  }


  navigateToProduct(product_id, color_id) {
    this.router.navigate(['/product', product_id, color_id]);
  }

  deletWishItem(wishItem) {
  }
}
