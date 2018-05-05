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

  campaingId: string = null;


  constructor(private httpService: HttpService, private snackBar: MatSnackBar, private router: Router,
    public dialog: MatDialog, private progressService: ProgressService) {
  }

  ngOnInit() {
    this.initForm();
    if (this.campaingId) {



    }

  }

  initForm() {
    this.campaingInfoForm = new FormBuilder().group({
      name: [null, [
        Validators.required,
      ]],
      discount_ref: [null, [
        Validators.required,
      ]],
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
    this.httpService.get(`campaign/${this.campaingId}`).subscribe(res => {

      this.originalCampaign = {
        name: res.name,
        discount_ref: res.discount_ref
      }
      this.campaingInfoForm.controls['name'].setValue(this.originalCampaign.name);
      this.campaingInfoForm.controls['discount_ref'].setValue(this.originalCampaign.discount_ref);
    }, err => {

    })


  }


  modifyCampaign() {
    const campaignInfo = {
      name: this.campaingInfoForm.controls['name'].value,
      discount_ref: this.campaingInfoForm.controls['discount_ref'].value,
    };
    this.upsertBtnShouldDisabled = true;
    this.deleteBtnShouldDisabled = true;

    let exec;
    if (this.campaingId)
      exec = this.httpService.post(`campaign/${this.campaingId}`, campaignInfo);
    else
      exec = this.httpService.put('campaign', campaignInfo);

    this.progressService.enable();

    exec.subscribe(
      (data) => {
        this.snackBar.open(`Campaign is ${this.campaingId ? 'updated' : 'added'}`, null, {
          duration: 2300,
        });

        this.deleteBtnShouldDisabled = false;
        this.anyChanges = false;
        this.progressService.disable();

      },
      (err) => {
        console.error();
        this.snackBar.open(`Cannot update this campaign. Try again`, null, {
          duration: 3200,
        });
        this.upsertBtnShouldDisabled = false;
        this.deleteBtnShouldDisabled = false;
        this.anyChanges = false;
        this.progressService.disable();

      }
    );
  }

  deleteCampaign(id: string = null): void {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`/campaign/${id}`).subscribe(
            (data) => {
              this.snackBar.open('Campaign delete successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.router.navigate(['agent/campaigns']);
            },
            (error) => {
              this.snackBar.open('Cannot delete this campaign. Please try again', null, {
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

  fieldChanged() {

    this.anyChanges = false;
    const name = this.campaingInfoForm.controls['name'].value ? this.campaingInfoForm.controls['name'].value : '';

    const discount_ref = this.campaingInfoForm.controls['discount_ref'].value ? this.campaingInfoForm.controls['discount_ref'].value : 0;

    const orig_name = this.originalCampaign.name;

    const orig_discount_ref = this.originalCampaign.discount_ref;

    if ((name !== orig_name && name) ||
      (discount_ref !== orig_discount_ref && discount_ref > 0)) {
      this.anyChanges = true;
    }
  }

  basicInfoValidation(Ac: AbstractControl) {
  }

  ngOnDestroy() {
  }
}
