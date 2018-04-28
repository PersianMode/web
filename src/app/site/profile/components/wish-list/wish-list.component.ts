import {Component, OnInit} from '@angular/core';
import {ProfileOrderService} from '../../../../shared/services/profile-order.service';
import {Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {dateFormatter} from '../../../../shared/lib/dateFormatter';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ResponsiveService} from '../../../../shared/services/responsive.service';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';


@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  displayedColumns = ['col_no', 'thumbnail', 'name', 'size', 'date', 'delete'];
  profileWishList = [];
  isMobile = false;

  constructor(private profileOrderService: ProfileOrderService, private router: Router,
              private responsiveService: ResponsiveService,
              private dialog: MatDialog, protected httpService: HttpService,
              protected progressService: ProgressService, private snackBar: MatSnackBar) {
    this.isMobile = this.responsiveService.isMobile;
  }

  ngOnInit() {
    this.profileOrderService.wishListArray.subscribe(result => {
      if (!result.length)
        return;
      else {
        this.profileWishList = result;
        this.profileWishList.forEach(el => [el.jalali_date, el.time] = dateFormatter(el.wish_list.adding_time));
      }
    });
    this.profileOrderService.getWishList();
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
  }


  navigateToProduct(product_id, color_id) {
    this.router.navigate(['/product', product_id, color_id]);
  }

  deletWishItem(wishItem) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`wishlist/delete/${wishItem}`).subscribe(
            (data) => {
              this.profileWishList = this.profileWishList.filter(el => el._id !== wishItem);
              this.progressService.disable();
              this.ngOnInit();
              this.snackBar.open('کالا از لیست علاقمندی های شما حذف شد', null, {
                duration: 3200
              });
            },
            error => {
              this.snackBar.open('محصول از لیست علاقمندی های شما حذف نشد، لطفا دوباره تلاش کنید', null, {
                duration: 3200
              });
              this.progressService.disable();
            });
        }
      },
      (err) => {
        console.log('Error in dialog: ', err);
      });
  }


  getThumbnailURL(product) {
    return imagePathFixer(product.colors[0].image.thumbnail, product._id, product.colors[0]._id);


  }
}
