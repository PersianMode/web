import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, CheckboxRequiredValidator} from '@angular/forms';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar, MatTableDataSource, MatDialog} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {RemovingConfirmComponent} from 'app/shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-duration-form',
  templateUrl: './duration-form.component.html',
  styleUrls: ['./duration-form.component.css']
})
export class DurationFormComponent implements OnInit {
  duration_id: string = null;
  addEditId: string = null;
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
  freeDeliveryDisplayedColumns = ['position', 'province', 'min_price', 'edit', 'remove'];
  freeDeliveryDataSource = new MatTableDataSource();
  provinceList = [];
  freeDeliveryItem = {
    id: null,
    province: null,
    min_price: null
  };

  constructor(private route: ActivatedRoute, private httpService: HttpService, private snackBar: MatSnackBar,
    private progressService: ProgressService, protected router: Router, private location: Location,
    private http: HttpClient, private dialog: MatDialog) {
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

    this.getProviceList();
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
      name: [null, [
        Validators.required,
      ]],
      delivery_days: [null, [
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
        this.durationForm.controls['name'].setValue(data.name);
        this.durationForm.controls['delivery_days'].setValue(data.delivery_days);
        this.durationForm.controls['city_cost'].setValue(data.cities[0].delivery_cost);
        data.delivery_loyalty.forEach(el => {
          this.costValue[el.name] = el.price;
          this.formLoyaltyInfo.filter(item => item._id === el._id)[0].discount = el.discount;
        });

        // Fetch free delivery items
        const tempFreeDelivery = [];
        if (data.free_delivery_options) {
          let counter = 0;
          data.free_delivery_options.forEach(el => {
            tempFreeDelivery.push({
              id: el._id,
              position: ++counter,
              province: el.province,
              min_price: el.min_price,
            });
          });
        }
        this.freeDeliveryDataSource.data = tempFreeDelivery;

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

  getProviceList() {
    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.provinceList = info.map(el => el.name);
      }, err => {
        console.log('err: ', err);
      }
    );
  }

  fieldChanged() {
    if (!this.duration_id) {
      return;
    }
    this.anyChanges = false;
    let name = this.durationForm.controls['name'].value ? this.durationForm.controls['name'].value : '';
    name = name.trim();
    const delivery_days = this.durationForm.controls['delivery_days'].value ? this.durationForm.controls['delivery_days'].value : '';
    const city_cost = this.durationForm.controls['city_cost'].value;
    let loaded_name = this.loadedDurationInfo.name;
    loaded_name = loaded_name.trim();
    const loaded_delivery_days = this.loadedDurationInfo.delivery_days;
    const loaded_city_cost = this.loadedDurationInfo.cities[0].delivery_cost;
    if ((name !== loaded_name && (name !== '' || loaded_name !== null)) ||
      (delivery_days !== loaded_delivery_days && (delivery_days !== '' || loaded_delivery_days !== null)) ||
      (city_cost !== loaded_city_cost && (city_cost !== '' || loaded_city_cost !== null))) {
      this.anyChanges = true;
    }
    this.fieldValidation();
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  changeValue(item) {
    this.fieldValidation();
    this.anyFiledChanges = false;
    const loaded_delivery_loyalty = this.loadedDurationInfo ? this.loadedDurationInfo.delivery_loyalty : [];
    const tempValue = loaded_delivery_loyalty.filter(l => l._id === item._id);
    if (tempValue[0] && tempValue[0].price !== this.costValue[item.name])
      this.anyFiledChanges = true;
  }

  fieldValidation() {
    this.filedValidation = true;
    if (this.costValue && this.costValue.length) {
      this.costValue.forEach(el => {
        if (!this.costValue[el])
          this.filedValidation = false;
      });
    }
    ;
  }

  saveDurationInfo(id: string = null) {
    this.formLoyaltyInfo.forEach(el => el.price = this.costValue[el.name]);
    const durationInfo = {
      _id: this.duration_id ? this.duration_id : null,
      is_c_and_c: false,
      name: this.durationForm.controls['name'].value,
      delivery_days: this.durationForm.controls['delivery_days'].value,
      cities: [{
        'name': 'تهران',
        'delivery_cost': this.durationForm.controls['city_cost'].value,
      }
      ],
      delivery_loyalty: this.formLoyaltyInfo,
    };
    this.progressService.enable();
    this.httpService.post('deliveryduration', durationInfo).subscribe(
      res => {
        this.addEditId = res._id;
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
        } else {
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

  backToComponent() {
    const tempId = this.addEditId ? this.addEditId : this.duration_id;
    this.router.navigate([`/agent/deliverycost/${tempId}`]);
  }

  editFreeDeliveryOption(id) {
    const foundData = this.freeDeliveryDataSource.data.find((el: any) => el.id === id);
    this.freeDeliveryItem = {
      id: id,
      province: foundData['province'],
      min_price: foundData['min_price'],
    };
  }

  removeFreeDeliveryOption(id) {
    if (!id) {
      return;
    }

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
      data: {
        name: 'ارسال رایگان ' + this.freeDeliveryDataSource.data.find((el: any) => el.id === id)['province']
      }
    });

    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.post('delivery/cost/free/delete', {
            id: id,
            delivery_duration_id: this.duration_id,
          }).subscribe(
            data => {
              const currentDataList = this.freeDeliveryDataSource.data.filter((el: any) => el.id !== id);
              let counter = 0;
              currentDataList.forEach(el => {
                el['position'] = ++counter;
              });
              this.freeDeliveryDataSource.data = currentDataList;
              this.snackBar.open('مورد انتخابی با موفقیت حذف شد', null, {
                duration: 2000,
              });
              this.progressService.disable();
            },
            err => {
              this.progressService.disable();
              console.error('Error when removing the freeDelivery item: ', err);
              this.snackBar.open('خطایی در هنگام حذف مورد انتخابی رخ داده است. ' + err.message, 'بستن');
            });
        }
      });
  }

  applyFreeDeliveryChanges() {
    if (!this.freeDeliveryItem.province || !this.freeDeliveryItem.min_price) {
      return;
    }

    this.progressService.enable();
    this.httpService.post('delivery/cost/free', Object.assign({
      delivery_duration_id: this.duration_id,
    }, this.freeDeliveryItem)).subscribe(
      data => {
        if (this.freeDeliveryItem.id) {
          const foundData = this.freeDeliveryDataSource.data.find((el: any) => el.id === this.freeDeliveryItem.id);
          foundData['province'] = this.freeDeliveryItem.province;
          foundData['min_price'] = this.freeDeliveryItem.min_price;
        } else {
          const currentData = this.freeDeliveryDataSource.data;
          currentData.push({
            position: currentData.length + 1,
            id: data.id,
            province: this.freeDeliveryItem.province,
            min_price: this.freeDeliveryItem.min_price,
          });
          this.freeDeliveryDataSource.data = currentData;
        }
        this.snackBar.open('تغییرات با موفقیت ثبت شد', null, {
          duration: 2000
        });
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('Error when apply free delivery item changes: ', err);
        this.snackBar.open('خطایی در هنگام اعمال تغییرات رخ داده است. ' + err.message, 'بستن');
      });
  }

  clearFreeDeliveryFields() {
    this.freeDeliveryItem = {
      id: null,
      province: null,
      min_price: null
    };
  }
}
