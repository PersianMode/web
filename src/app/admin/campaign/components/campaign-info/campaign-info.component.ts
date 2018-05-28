import {Component, Input, OnDestroy, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import * as moment from 'moment';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.css']
})
export class CampaignInfoComponent implements OnInit, OnDestroy {

  campaingInfoForm: FormGroup = null;
  showInsertButton = false;
  showEndButton = false;

  campaignId: string = null;

  start_date: string;
  end_date: string;
  dateError: boolean = false;

  collections: any[] = [];

  isCoupon: boolean = false;
  isActive: boolean = true;

  startDateError: boolean = false;
  endDateError: boolean = false;

  discountRefError: boolean = true;
  discountByPercent: boolean = true;

  constructor(private httpService: HttpService, private snackBar: MatSnackBar, private router: Router,
    public dialog: MatDialog, private progressService: ProgressService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      (params) => {
        this.campaignId = params['id'];
        if (this.campaignId) {

          this.showInsertButton = false;
          this.showEndButton = true;
          this.getCampaign();
        } else {
          this.showInsertButton = true;
          this.showEndButton = false;
        }

      });

    this.campaingInfoForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error(er)
    );

  }

  initForm() {
    this.campaingInfoForm = new FormBuilder().group({
      name: [null, [
        Validators.required,
      ]],
      discount_ref: [null, [
        Validators.required,
      ]],
      coupon_code: [null]
    });
  }

  getCampaign() {

    this.progressService.enable();
    this.httpService.get(`campaign/${this.campaignId}`).subscribe(res => {

      this.campaingInfoForm.controls['name'].setValue(res.name);
      this.campaingInfoForm.controls['discount_ref'].setValue(res.discount_ref);
      this.start_date = res.start_date;
      this.end_date = res.end_date;

      const now = new Date();

      const end = new Date(this.end_date);
      this.isActive = end > now;

      if (res.coupon_code) {

        this.isCoupon = true;
        this.campaingInfoForm.controls['coupon_code'].setValue(res.coupon_code);

      } else if (res.collection_ids) {
        this.isCoupon = false;
        this.collections = res.collection_ids;
      }
      this.progressService.disable();

    }, err => {
      this.snackBar.open(`خطا در دریافت اطلاعات کمپین`, null, {
        duration: 2300,
      });
      this.progressService.disable();
    })


  }

  setCampaign() {

    if (this.campaignId)
      return;


    const campaignInfo: any = {
      name: this.campaingInfoForm.controls['name'].value,
      discount_ref: this.campaingInfoForm.controls['discount_ref'].value,
    };

    campaignInfo.start_date = this.start_date;
    campaignInfo.end_date = this.end_date;

    if (this.isCoupon) {
      campaignInfo.coupon_code = this.campaingInfoForm.controls['coupon_code'].value;
      if (!campaignInfo.coupon_code || Number.parseInt(campaignInfo.coupon_code) <= 0) {
        this.snackBar.open(`ورود کد تخفیف الزامی است`, null, {
          duration: 3200,
        });
        return;
      }
    }


    this.progressService.enable();

    this.httpService.put('campaign', campaignInfo).subscribe(
      (data) => {
        this.snackBar.open(`تغییرات با موفقیت ثبت گردید`, null, {
          duration: 2300,
        });
        this.campaignId = data._id;

        const now = new Date();
        const end = new Date(this.end_date);
        this.isActive = end > now;

        this.showEndButton = true;
        this.showInsertButton = false;
        this.progressService.disable();
      },
      (err) => {
        console.error();
        this.snackBar.open(`خطا در بروز رسانی کمپین`, null, {
          duration: 3200,
        });
        this.showEndButton = false;
        this.showInsertButton = true;
        this.progressService.disable();
      }
    );
  }

  endCampaign(id: string = null): void {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`campaign/${this.campaignId}`).subscribe(
            (data) => {
              this.snackBar.open('کمپین با موفقیت به پایان رسید', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.router.navigate(['agent/campaigns']);
            },
            (error) => {
              this.snackBar.open('خطا در پایان کمپین. لطفا مجددا تلاش کنید', null, {
                duration: 2700
              });
              this.progressService.disable();
            }
          );
        }
      },
      (err) => {
        console.log('Error in dialog: ', err);
      }
    );
  }

  addCollection(collection) {
    this.progressService.enable();
    this.httpService.post(`campaign/collection/add`, {
      campaignId: this.campaignId,
      collectionId: collection._id
    }).subscribe(
      (data) => {
        this.collections.push(collection);
        this.progressService.disable();
      },
      (error) => {
        this.snackBar.open('خطا در اضافه کردن کالکشن به کمپین', null, {
          duration: 2700
        });
        this.progressService.disable();
      }
    );
  }

  removeCollection(collection) {

    this.progressService.enable();
    this.httpService.post(`campaign/collection/remove`, {
      campaignId: this.campaignId,
      collectionId: collection._id
    }).subscribe(
      (data) => {
        let index = this.collections.findIndex(x => x._id === collection._id);
        this.collections.splice(index, 1);
        this.progressService.disable();
      },
      (error) => {
        this.snackBar.open('خطا در حذف کالکشن از کمپین', null, {
          duration: 2700
        });
        this.progressService.disable();
      }
    );

  }

  viewCollection(collectionId) {

    this.router.navigate([`/agent/collections/form/${collectionId}`]);

  }

  setStartDate(start_date) {
    this.start_date = start_date;
    this.checkDateValidation();
  }

  setEndDate(end_date) {
    this.end_date = end_date;
    this.checkDateValidation();
  }

  checkDateValidation() {

    this.startDateError = false;
    if (!this.start_date) {
      this.startDateError = true;
      return;
    }

    if (!this.end_date) {
      this.endDateError = true;
      return;
    }

    let now, start, end;
    start = new Date(this.start_date);
    now = new Date();

    if (moment(moment(start).format('YYYY-MM-DD')).isBefore(moment(moment(now).format('YYYY-MM-DD')))) {
      this.startDateError = true;
      return;
    }
    if (this.start_date && this.end_date) {
      end = new Date(this.end_date);
      const endBeforeNow = moment(moment(end).format('YYYY-MM-DD')).isBefore(moment(moment(now).format('YYYY-MM-DD')));
      const endBeforeStart = moment(moment(end).format('YYYY-MM-DD')).isBefore(moment(moment(start).format('YYYY-MM-DD')));

      this.endDateError = endBeforeNow || endBeforeStart || start.toString() === end.toString();
      return;
    }
  }

  getDiscountInfo() {

    if (this.isCoupon)
      return {
        placeholder: 'درصد یا مقدار تخفیف (تومان)',
        hint: 'مقدار تخفیف به تومان یا درصد تخفیف را وارد نمایید',
        error: 'ورود میزان یا درصد تخفیف الزامی است'
      }
    else
      return {
        placeholder: 'درصد تخفیف',
        hint: 'درصد تخفیف را وارد نمایید',
        error: 'ورود درصد تخفیف الزامی است'
      }


  }

  fieldChanged() {
    this.discountRefError = !this.campaingInfoForm.controls['discount_ref'].value || (this.campaingInfoForm.controls['discount_ref'].value <= 0)
    if (this.discountRefError) {
      this.discountByPercent = true;
      return;
    }
    if (this.isCoupon) {
      this.discountByPercent = (this.campaingInfoForm.controls['discount_ref'].value >= 100);
    } else {
      if (this.campaingInfoForm.controls['discount_ref'].value >= 100)
        this.discountRefError = true;
      this.discountByPercent = true;
    }
  }

  ngOnDestroy() {
  }
}
