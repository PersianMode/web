import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  campaignInfoForm: FormGroup = null;
  showEndButton = false;
  isFieldChanged = false;
  isAdd = false;
  campaignPrev = {};

  campaignId: string = null;

  start_date: string;
  end_date: string;

  collections: any[] = [];

  isCoupon = false;
  isActive = true;

  startDateError = false;
  endDateError = false;

  discountRefError = true;
  discountByPercent = true;

  constructor(private httpService: HttpService, private snackBar: MatSnackBar, private router: Router,
              public dialog: MatDialog, private progressService: ProgressService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      params => {
        this.campaignId = params['id'];
        if (this.campaignId) {
          this.isAdd = false;
          this.showEndButton = true;
          this.isFieldChanged = false;
          this.getCampaign();
        } else {
          this.isAdd = true;
          this.showEndButton = false;
          this.isFieldChanged = true;
          this.start_date = moment(new Date()).format('YYYY-MM-DD');
        }
      });

    this.campaignInfoForm.valueChanges.subscribe(
      dt => this.fieldChanged(),
      er => console.error(er)
    );
  }

  onCouponChange($event) {
    this.isCoupon = $event.checked;
    this.fieldChanged();
  }

  initForm() {
    this.campaignInfoForm = new FormBuilder().group({
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
      this.campaignInfoForm.controls['name'].setValue(res.name);
      this.campaignInfoForm.controls['discount_ref'].setValue(res.discount_ref);
      this.start_date = res.start_date;
      this.end_date = res.end_date;

      const now = new Date();

      const end = new Date(this.end_date);
      this.isActive = end > now;

      if (res.coupon_code) {
        this.isCoupon = true;
        this.campaignInfoForm.controls['coupon_code'].setValue(res.coupon_code);
      } else if (res.collection_ids) {
        this.isCoupon = false;
        this.collections = res.collection_ids;
      }

      this.campaignPrev = {
        name: res.name,
        discount_ref: res.discount_ref,
        start_date: res.start_date,
        end_date: res.end_date,
        coupon_code: res.coupon_code || null,
      };
      this.progressService.disable();
    }, err => {
      this.snackBar.open(`خطا در دریافت اطلاعات کمپین`, null, {
        duration: 2300,
      });
      this.progressService.disable();
    });
  }

  setCampaign() {
    const campaignInfo: any = {
      name: this.campaignInfoForm.controls['name'].value,
      discount_ref: this.campaignInfoForm.controls['discount_ref'].value,
    };

    if (this.campaignId)
      campaignInfo['campaignId'] = this.campaignId;

    campaignInfo.start_date = this.start_date;
    campaignInfo.end_date = this.end_date;

    if (this.isCoupon) {
      campaignInfo.coupon_code = this.campaignInfoForm.controls['coupon_code'].value;
      if (!campaignInfo.coupon_code || Number.parseInt(campaignInfo.coupon_code) <= 0) {
        this.snackBar.open(`ورود کد تخفیف الزامی است`, null, {
          duration: 3200,
        });
        return;
      }
    }

    this.progressService.enable();
    this.httpService.put('campaign', campaignInfo).subscribe(
      data => {
        const controls = this.campaignInfoForm.controls;
        this.campaignPrev = {
          name: controls['name'].value,
          discount_ref: controls['discount_ref'].value,
          start_date: this.start_date,
          end_date: this.end_date,
          coupon_code: controls['coupon_code'].value,
        };
        this.isFieldChanged = false;
        this.snackBar.open(`تغییرات با موفقیت ثبت گردید`, null, {
          duration: 2300,
        });

        if (data._id) {
          this.campaignId = data._id;
          this.isAdd = false;
        }

        const now = new Date();
        const end = new Date(this.end_date);
        this.isActive = end > now;

        this.showEndButton = true;
        this.progressService.disable();
      },
      err => {
        console.error('error in sending campaign info: ', err);
        this.snackBar.open(`خطا در بروز رسانی کمپین`, null, {
          duration: 3200,
        });
        this.showEndButton = false;
        this.progressService.disable();
      }
    );
  }

  endCampaign(id: string = null): void {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`campaign/${this.campaignId}`).subscribe(
            data => {
              this.snackBar.open('کمپین با موفقیت به پایان رسید', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.router.navigate(['agent/campaigns']);
            },
            error => {
              this.snackBar.open('خطا در پایان کمپین. لطفا مجددا تلاش کنید', null, {
                duration: 2700
              });
              this.progressService.disable();
            }
          );
        }
      },
      err => {
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
      data => {
        this.collections.push(collection);
        this.progressService.disable();
      },
      error => {
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
      data => {
        const index = this.collections.findIndex(x => x._id === collection._id);
        this.collections.splice(index, 1);
        this.progressService.disable();
      },
      error => {
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
    if (moment(start).isBefore(moment(now), 'day')) {
      this.startDateError = true;
      return;
    }

    end = new Date(this.end_date);
    const endBeforeNow = moment(end).isBefore(moment(now), 'day');
    const endBeforeStart = moment(end).isBefore(moment(start), 'day');

    this.endDateError = endBeforeNow || endBeforeStart || start.toString() === end.toString();

    if (!this.isAdd) {
      this.isFieldChanged = false;
      if (!moment(this.campaignPrev['start_date']).isSame(moment(this.start_date), 'day'))
        this.isFieldChanged = true;
      if (!moment(this.campaignPrev['end_date']).isSame(moment(this.end_date), 'day'))
        this.isFieldChanged = true;
    }
  }

  getDiscountInfo() {
    if (this.isCoupon)
      return {
        placeholder: 'درصد یا مقدار تخفیف (تومان)',
        hint: 'مقدار تخفیف به تومان یا درصد تخفیف را وارد نمایید',
        error: 'ورود میزان یا درصد تخفیف الزامی است'
      };
    else
      return {
        placeholder: 'درصد تخفیف',
        hint: 'درصد تخفیف را وارد نمایید',
        error: 'ورود درصد تخفیف الزامی است'
      };
  }

  fieldChanged() {
    // base validation
    const controls = this.campaignInfoForm.controls;
    this.discountRefError = !controls['discount_ref'].value || (controls['discount_ref'].value <= 0);
    if (this.discountRefError) {
      this.discountByPercent = true;
      // return;
    }
    if (this.isCoupon) {
      this.discountByPercent = !(controls['discount_ref'].value >= 100);
    } else {
      if (controls['discount_ref'].value >= 100)
        this.discountRefError = true;
      this.discountByPercent = true;
    }

    // changed fields
    if (!this.isAdd) {
      this.isFieldChanged = false;
      Object
        .keys(this.campaignPrev)
        .filter(el => el !== 'start_date' && el !== 'end_date')
        .forEach(el => {
          if (controls[el].value !== this.campaignPrev[el])
            this.isFieldChanged = true;
        });
    }
  }

  ngOnDestroy() {
  }
}
