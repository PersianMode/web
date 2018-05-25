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
import {AuthService} from '../../../../shared/services/auth.service';
import {DictionaryService} from '../../../../shared/services/dictionary.service';


@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  displayedColumns = ['col_no', 'thumbnail', 'name', 'size', 'date', 'delete'];
  profileWishList = [];
  isMobile = false;
  displaySize = null;

  constructor(private profileOrderService: ProfileOrderService, private router: Router,
    private responsiveService: ResponsiveService,
    private dialog: MatDialog, protected httpService: HttpService,
    protected progressService: ProgressService, private snackBar: MatSnackBar,
    private auth: AuthService, private dict: DictionaryService) {
    this.isMobile = this.responsiveService.isMobile;
  }

  ngOnInit() {
    this.profileOrderService.wishListArray.subscribe(result => {
      if (!result.length) {
        this.profileWishList = [];
        return;
      } else {
        this.profileWishList = result;
        this.profileWishList.forEach(
          el => {
            const gender = el.product[0].tags.find(tag => tag.tg_name.toUpperCase() === 'GENDER').name;
            [el.jalali_date, el.time] = dateFormatter(el.wish_list.adding_time);
            el.product[0].displaySize = el.wish_list.product_instance_id ?
              this.dict.setShoesSize(el.product[0].instances[0].size, gender, el.product[0].product_type.name) :
              null;
          });
        console.log(this.profileWishList);
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
              this.snackBar.open('کالا از لیست علاقمندی‌های شما حذف شد', null, {
                duration: 3200
              });
            },
            error => {
              this.snackBar.open('محصول از لیست علاقمندی‌های شما حذف نشد، لطفا دوباره تلاش کنید', null, {
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
