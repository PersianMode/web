import {Component, Input, OnDestroy, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {ProgressService} from '../../../../shared/services/progress.service';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.css']
})
export class CampaignInfoComponent implements OnInit, OnDestroy {

  campaingInfoForm: FormGroup = null;
  upsertBtnShouldDisabled = false;
  deleteBtnShouldDisabled = false;
  anyChanges = false;
  originalCampaign: any = null;

  campaignId: string = null;

  start_date: string;
  end_date: string;
  dateError: boolean = false;

  collections: any[] = [];


  type: string = 'collection'

  constructor(private httpService: HttpService, private snackBar: MatSnackBar, private router: Router,
    public dialog: MatDialog, private progressService: ProgressService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(
      (params) => {
        this.campaignId = params['id'];
        if (this.campaignId) {
          this.getCampaign();
        }else{
          this.deleteBtnShouldDisabled = true;
        }

      });

  }

  initForm() {
    this.campaingInfoForm = new FormBuilder().group({
      name: [null, [
        Validators.required,
      ]],
      discount_ref: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(100)
      ]],
      coupon_code: [null]
    },
      {
        validator: this.basicInfoValidation
      });

    this.campaingInfoForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error(er)
    );
  }

  getCampaign() {

    this.progressService.enable();
    this.httpService.get(`campaign/${this.campaignId}`).subscribe(res => {

      this.originalCampaign = {
        name: res.name,
        discount_ref: res.discount_ref,
        start_date: res.start_date,
        end_date: res.end_date
      };

      this.campaingInfoForm.controls['name'].setValue(this.originalCampaign.name);
      this.campaingInfoForm.controls['discount_ref'].setValue(this.originalCampaign.discount_ref);
      this.start_date = res.start_date;
      this.end_date = res.end_date;

      if (res.coupon_code) {

        this.type = 'couponCode';

        this.originalCampaign.coupon_code = res.coupon_code;
        this.campaingInfoForm.controls['coupon_code'].setValue(this.originalCampaign.coupon_code);
        this.collections = [];

      } else if (res.collection_ids) {

        this.type = 'collection';

        this.collections = res.collection_ids;
        this.originalCampaign.coupon_code = null;
        this.campaingInfoForm.controls['coupon_code'].setValue(null);
      }
      this.progressService.disable();

    }, err => {
      this.snackBar.open(`خطا در دریافت اطلاعات کمپین`, null, {
        duration: 2300,
      });
      this.progressService.disable();
    })


  }


  modifyCampaign() {
    const campaignInfo: any = {
      name: this.campaingInfoForm.controls['name'].value,
      discount_ref: this.campaingInfoForm.controls['discount_ref'].value,
    };
    if (this.start_date)
      campaignInfo.start_date = this.start_date;
    if (this.end_date)
      campaignInfo.end_date = this.end_date;


    this.upsertBtnShouldDisabled = true;
    this.deleteBtnShouldDisabled = true;

    let exec;
    if (this.campaignId) {

      if (this.campaingInfoForm.controls['coupon_code'].value)
        campaignInfo.coupon_code = this.campaingInfoForm.controls['coupon_code'].value;

      exec = this.httpService.post(`campaign/${this.campaignId}`, campaignInfo);

    } else
      exec = this.httpService.put('campaign', campaignInfo);

    this.progressService.enable();

    exec.subscribe(
      (data) => {
        console.log('-> ', data);
        this.snackBar.open(`تغییرات با موفقیت ثبت گردید`, null, {
          duration: 2300,
        });
        if (!this.campaignId)
          this.campaignId = data._id;


        this.originalCampaign = campaignInfo;

        if (this.campaignId && this.originalCampaign.coupon_code)
          this.collections = [];

        this.deleteBtnShouldDisabled = false;
        this.upsertBtnShouldDisabled = false;
        this.anyChanges = false;
        this.progressService.disable();

      },
      (err) => {
        console.error();
        this.snackBar.open(`خطا در بروز رسانی کمپین`, null, {
          duration: 3200,
        });
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
        this.progressService.disable();

      }
    );
  }

  removeCampaign(id: string = null): void {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`campaign/${id}`).subscribe(
            (data) => {
              this.snackBar.open('کمپین با موفقیت حذف گردید', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.router.navigate(['agent/campaigns']);
            },
            (error) => {
              this.snackBar.open('خطا در حذف کمپین. لطفا مجددا تلاش کنید', null, {
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
        this.collections.push(collection)

        this.originalCampaign.coupon_code = null;
        this.campaingInfoForm.controls['coupon_code'].setValue(null);

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

        this.originalCampaign.coupon_code = null;
        this.campaingInfoForm.controls['coupon_code'].setValue(null);

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
    if (this.start_date && this.end_date) {
      this.dateError = new Date(this.end_date) <= new Date(this.start_date);
    } else if (!this.start_date && !this.end_date)
      this.dateError = false;
    else
      this.dateError = true;

    if (!this.dateError)
      this.fieldChanged();
  }

  fieldChanged() {

    this.anyChanges = false;
    const name = this.campaingInfoForm.controls['name'].value ? this.campaingInfoForm.controls['name'].value.trim() : '';
    const discount_ref = this.campaingInfoForm.controls['discount_ref'].value ? this.campaingInfoForm.controls['discount_ref'].value : 0;
    const coupon_code = this.campaingInfoForm.controls['coupon_code'].value ? this.campaingInfoForm.controls['coupon_code'].value.trim() : '';

    const orig_name = this.originalCampaign ? this.originalCampaign.name : null;
    const orig_discount_ref = this.originalCampaign ? this.originalCampaign.discount_ref : null;
    const orig_start_date = this.originalCampaign ? this.originalCampaign.start_date : null;
    const orig_end_date = this.originalCampaign ? this.originalCampaign.end_date : null;
    const orig_coupon_code = this.originalCampaign ? this.originalCampaign.coupon_code : null;


    if ((name !== orig_name && name) ||
      (discount_ref !== orig_discount_ref && discount_ref > 0) ||
      (this.start_date !== orig_start_date && this.start_date) ||
      (this.end_date !== orig_end_date && this.end_date) ||
      (coupon_code !== orig_coupon_code && coupon_code)) {
      this.anyChanges = true;
    }
  }

  basicInfoValidation(Ac: AbstractControl) {
  }


  ngOnDestroy() {
  }
}
