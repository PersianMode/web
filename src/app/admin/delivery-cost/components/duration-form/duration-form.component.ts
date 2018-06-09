import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {isUndefined} from 'util';

@Component({
  selector: 'app-duration-form',
  templateUrl: './duration-form.component.html',
  styleUrls: ['./duration-form.component.css']
})
export class DurationFormComponent implements OnInit {
  duration_id: string = null;
  durationForm: FormGroup = null;
  loyaltyNameList;
  seen: any = {};
  curFocus = null;
  costValue = [];
  filedValidation = false;
  anyChanges = false;
  formLoyaltyInfo = [];
  upsertBtnShouldDisabled = false;
  loadedDurationInfo: any = null;
  anyFiledChanges = false;

  constructor(private route: ActivatedRoute, private http: HttpClient,
              private httpService: HttpService, private snackBar: MatSnackBar,
              private progressService: ProgressService) {
  }

  ngOnInit() {
    this.getLoyaltyGroup();
    this.initForm();
    this.route.params.subscribe(
      (params) => {
        this.duration_id = params['id'] && params['id'] !== 'null' ? params['id'] : null;
        this.initDurationFormInfo();
      }
    );
  }

  getLoyaltyGroup() {
    this.progressService.enable();
    this.httpService.get('loyaltygroup').subscribe(
      data => {
        this.loyaltyNameList = data;
        this.loyaltyNameList.forEach(el => {
          this.costValue.push(el.name);
        });
        this.loyaltyNameList.forEach(el => {
          this.formLoyaltyInfo.push({
            _id: el._id,
            name: el.name,
            price: null,
            discount: null
          });
        });
        this.progressService.disable();
      },
      err => {
        console.error('Cannot get loyalty groups: ', err);
        this.snackBar.open('قادر به دریافت اطلاعات گروه های وفاداری نیستیم. دوباره تلاش کنید', null, {
          duration: 3200,
        });
        this.progressService.disable();
      }
    );
  }

  initForm() {
    this.durationForm = new FormBuilder().group({
      duration_name: [null, [
        Validators.required,
      ]],
      delivery_duration: [null, [
        Validators.required,
      ]],
      city_cost: [null, [
        Validators.required,
      ]],
    });

    this.durationForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error(er)
    );
  }

  initDurationFormInfo() {
    if (!this.duration_id) {
      return;
    }

    this.progressService.enable();
    this.upsertBtnShouldDisabled = true;
    this.httpService.get(`deliveryduration/${this.duration_id}`).subscribe(
      (data) => {
        this.loadedDurationInfo = data;
        this.durationForm.controls['duration_name'].setValue(data.name);
        this.durationForm.controls['delivery_duration'].setValue(data.duration_value);
        this.durationForm.controls['city_cost'].setValue(data.duration_cities[0].delivery_cost);
        data.duration_loyalty_info.forEach(el => {
          this.costValue[el.name] = el.price;
        });
        this.upsertBtnShouldDisabled = false;
        this.progressService.disable();
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Cannot get page details. Please try again', null, {
          duration: 2500,
        });

        this.progressService.disable();
        this.upsertBtnShouldDisabled = false;
      }
    );
  }

  modifyDuration() {
  }

  fieldChanged() {
    if (!this.duration_id) {
      return;
    }
    this.anyChanges = false;
    const duration_name = this.durationForm.controls['duration_name'].value ? this.durationForm.controls['duration_name'].value : '';
    const duration_value = this.durationForm.controls['delivery_duration'].value ? this.durationForm.controls['delivery_duration'].value : '';
    const city_cost = this.durationForm.controls['city_cost'].value;
    const loaded_name = this.loadedDurationInfo.name;
    const loaded_duration_value = this.loadedDurationInfo.duration_value;
    const loaded_city_cost = this.loadedDurationInfo.duration_cities[0].name;
    if ((duration_name !== loaded_name && (duration_name !== '' || loaded_name !== null)) ||
      (duration_value !== loaded_duration_value && (duration_value !== '' || loaded_duration_value !== null)) ||
      (city_cost !== loaded_city_cost && (city_cost !== '' || loaded_city_cost !== null))) {
      this.anyChanges = true;
    }
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  changeValue(item) {
    this.anyFiledChanges = false;
    this.filedValidation = true;
    if (this.costValue && this.costValue.length) {
      this.costValue.forEach(el => {
        if (!this.costValue[el])
          this.filedValidation = false;
      });
    }
    ;
    const loaded_duration_loyalty_info = this.loadedDurationInfo.duration_loyalty_info;
    const tempValue = loaded_duration_loyalty_info.filter(l => l._id === item._id);
    if (tempValue[0].price !== this.costValue[item.name])
      this.anyFiledChanges = true;

  }

  saveDurationInfo(id: string = null) {
    this.formLoyaltyInfo.forEach(el => el.price = this.costValue[el.name]);
    let durationInfo = {
      _id: this.duration_id ? this.duration_id : null,
      name: this.durationForm.controls['duration_name'].value,
      duration_value: this.durationForm.controls['delivery_duration'].value,
      duration_cities: [{
        'name': 'تهران',
        'delivery_cost': this.durationForm.controls['city_cost'].value,
      }
      ],
      duration_loyalty_info: this.formLoyaltyInfo,
    };
    this.progressService.enable();
    this.httpService.post('deliveryduration', durationInfo).subscribe(
      res => {
        this.snackBar.open('تغییرات با موفقیت ثبت شدند', null, {
          duration: 2300,
        });
        this.progressService.disable();
        if (!this.duration_id) {
          this.durationForm.reset();
          this.loyaltyNameList.forEach(el => {
            this.costValue[el.name] = null;
            this.seen[el.name] = false;
          });
        }
        else {
          this.anyChanges = false;
          this.anyFiledChanges = false;
        }
      },
      err => {
        console.error('Cannot upsert delivery duration info: ', err);
        this.snackBar.open('سیستم قادر به اعمال تغییرات شما نیست. دوباره تلاش کنید', null, {
          duration: 3200,
        });
        this.progressService.disable();
      });
  }
}
