import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {MatSnackBar, MatDialog} from '@angular/material';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-loyalty-group',
  templateUrl: './loyaltygroup.component.html',
  styleUrls: ['./loyaltygroup.component.css']
})
export class LoyaltyGroupComponent implements OnInit {
  lgForm: FormGroup;
  loyaltyGroups = [];
  selectedGroup = null;
  anyChanges = false;

  constructor(private httpService: HttpService, private progressService: ProgressService,
    private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
    this.initForm();

    this.lgForm.valueChanges.subscribe(() => this.fieldChanged());

    this.getGroups();
  }

  initForm() {
    this.lgForm = new FormBuilder().group({
      name: [null, [
        Validators.required,
      ]],
      min_score: [null, [
        Validators.required,
      ]]
    });
  }

  getGroups() {
    this.progressService.enable();
    this.httpService.get('loyaltygroup').subscribe(
      data => {
        this.loyaltyGroups = data;
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('Cannot get loyalty groups: ', err);
        this.snackBar.open('قادر به دریافت اطلاعات گروه های وفاداری نیستیم. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }

  upsertGroup() {
    if (!this.anyChanges)
      return;

    this.progressService.enable();
    this.httpService.post('loyaltygroup/modify', {
      _id: this.selectedGroup ? this.selectedGroup._id : null,
      name: this.lgForm.controls['name'].value,
      min_score: this.lgForm.controls['min_score'].value,
    }).subscribe(
      res => {
        this.snackBar.open('تغییرات با موفقیت ثبت شدند', null, {
          duration: 2300,
        });
        if (!this.selectedGroup) {
          this.loyaltyGroups.push({
            _id: res._id,
            name: this.lgForm.controls['name'].value,
            min_score: this.lgForm.controls['min_score'].value,
          });
        }
        this.progressService.disable();
      },
      err => {
        console.error('Cannot upsert loyalty group: ', err);
        this.snackBar.open('سیستم قادر به اعمال تغییرات شما نیست. دوباره تلاش کنید', null, {
          duration: 3200,
        });
        this.progressService.disable();
      });
  }

  edit(id) {
    const lgObj = this.loyaltyGroups.find(el => el._id === id);
    this.selectedGroup = lgObj;
    this.lgForm.controls['name'].setValue(lgObj.name);
    this.lgForm.controls['min_score'].setValue(lgObj.min_score);
  }

  remove(id) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });

    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.post('loyaltygroup/delete', {
            _id: id,
          }).subscribe(
            data => {
              this.lgForm.reset();
              this.selectedGroup = null;
              this.loyaltyGroups = this.loyaltyGroups.filter(el => el._id !== id);
              this.snackBar.open('گروه وفاداری مورد نظر با موفقیت حذف شد', null, {
                duration: 2300,
              });
              this.progressService.disable();

            },
            er => {
              console.error('Cannot remove selected item: ', er);
              this.snackBar.open('سیستم قادر به حذف این گروه وفاداری نیست. دوباره تلاش کنید', null, {
                duration: 3200,
              });
              this.progressService.disable();
            });
        }
      },
      err => {
        console.error('Error when subscribing on rmDialog.afterClosed() function: ', err);
      });
  }

  fieldChanged() {
    this.anyChanges = !this.selectedGroup || false;

    if (this.selectedGroup) {
      Object.keys(this.lgForm.controls).forEach(el => {
        if (this.selectedGroup[el] !== this.lgForm.controls[el].value)
          this.anyChanges = true;
      });
    }
  }
}
