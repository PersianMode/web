import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-c-and-c',
  templateUrl: './c-and-c.component.html',
  styleUrls: ['./c-and-c.component.css']
})
export class CAndCComponent implements OnInit {

  clickAndCollectInfo;
  anyChanges = false;
  selectedGroup: any = null;
  cAndCForm: FormGroup = null;
  upsertBtnShouldDisabled = true;

  constructor(private httpService: HttpService, private progressService: ProgressService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.initForm();
    this.cAndCForm.valueChanges.subscribe(() => this.fieldChanged());
    this.getClickAndCollect();
  }

  initForm() {
    this.cAndCForm = new FormBuilder().group({
      name: [null, [
        Validators.required,
      ]],
      loyalty_point: [null, [
        Validators.required,
      ]]
    });
  }

  getClickAndCollect() {
    this.httpService.get('deliverycc').subscribe(
      data => {
        if (!data.length) {
          this.getGroups();
        } else {
          this.clickAndCollectInfo = data[0];
        }
      },
      err => {
        console.error('Cannot get click and collect delivery: ', err);
        this.snackBar.open('سیستم قادر به دریافت اطلاعات گروه های وفاداری نیست. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }

  getGroups() {
    this.httpService.get('loyaltygroup').subscribe(
      data => {
        data.forEach(el => el.added_point = null);
        data.forEach(el => delete el.min_score);
        const add_point = [];
        data.forEach(el => add_point.push(el));
        this.clickAndCollectInfo = {
          is_c_and_c: true,
          add_point: add_point,
        };
      },
      err => {
        console.error('Cannot get loyalty groups: ', err);
        this.snackBar.open('سیستم قادر به دریافت اطلاعات گروه های وفاداری نیست. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }

  fieldChanged() {
    this.anyChanges = false;
    const formName = this.cAndCForm.controls['name'].value;
    const loadedName = this.selectedGroup.name;
    const formPoint = this.cAndCForm.controls['loyalty_point'].value;
    const loadedPoint = this.selectedGroup.added_point;
    if (this.selectedGroup) {
      if (formPoint !== loadedPoint && (formPoint !== '' || loadedPoint !== null)
        || (formName !== loadedName && (formName !== '' || loadedName !== null)))
        this.anyChanges = true;
    }
  }

  editPoint(item) {
    this.selectedGroup = item;
    this.cAndCForm.controls['name'].setValue(item.name);
    this.cAndCForm.controls['loyalty_point'].setValue(item.added_point ? item.added_point : null);
  }

  upsertLoyaltyPoint() {
    this.upsertBtnShouldDisabled = true;
    if (!this.anyChanges)
      return;
    this.selectedGroup.added_point = this.cAndCForm.controls['loyalty_point'].value;
    if (!this.clickAndCollectInfo.add_point.filter(el => !el.added_point).length)
      this.upsertBtnShouldDisabled = false;
    this.cAndCForm.reset();
  }

  submitTotalInfo() {
    if (this.clickAndCollectInfo.is_c_and_c === false)
      return;
    this.progressService.enable();
    this.httpService.post('deliverycc', this.clickAndCollectInfo).subscribe(
      res => {
        this.snackBar.open('تغییرات با موفقیت ثبت شدند', null, {
          duration: 2300,
        });
        this.progressService.disable();
        this.cAndCForm.reset();
        this.upsertBtnShouldDisabled = true;
      },
      err => {
        console.error('Cannot upsert delivery duration info: ', err);
        this.snackBar.open('سیستم قادر به اعمال تغییرات شما نیست. دوباره تلاش کنید', null, {
          duration: 3200,
        });
        this.progressService.disable();
      });
  };

  formatter(number) {
    return priceFormatter(number);
  }
}
