import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {CheckoutService} from '../../services/checkout.service';
import {IAddressInfo} from '../../interfaces/iaddressInfo.interface';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {isUndefined} from 'util';
import {CartService} from 'app/shared/services/cart.service';

@Component({
  selector: 'app-upsert-address',
  templateUrl: './upsert-address.component.html',
  styleUrls: ['./upsert-address.component.css']
})
export class UpsertAddressComponent implements OnInit {
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();
  dialogTitle;
  buttonTitle;
  addressForm: FormGroup;
  cityArray = [];
  provinceArray: any;
  anyChanges = false;
  gender = [{
    name: 'خانم',
    value: 'f'
  }, {
    name: 'آقا',
    value: 'm'
  }];
  title;
  addressData: any;
  addressInfo: IAddressInfo;
  emailRequired = false;
  withDelivery = null;

  constructor(private authService: AuthService, private http: HttpClient,
              private checkoutService: CheckoutService, private router: Router,
              private location: Location) {
  }


  ngOnInit() {
    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.provinceArray = info;
        const province = this.provinceArray.find(el => el.name === (this.addressInfo.addressId ? this.addressData.province : 'تهران'));
        this.cityArray = province ? province.cities : [];
      }, err => {
        console.log('err: ', err);
      }
    );
    this.addressInfo = this.checkoutService.addressData;
    this.initializeData();
    this.dialogTitle = this.addressInfo.partEdit ? '' : this.addressInfo.addressId !== null ? 'ویرایش آدرس' : 'افزودن آدرس جدید';
    this.buttonTitle = 'ثبت اطلاعات';
    this.addressData = this.addressInfo.dialog_address;
    this.emailRequired = !this.authService.userIsLoggedIn();
    this.withDelivery = !this.addressInfo.partEdit;
    this.initForm();
  }

  onClose() {
    // TODO: guard is needed if any fields have been changed!
    if (this.isNotMobile) {
      this.closeDialog.emit(false);
    } else {
      this.location.back();
    }
  }

  initializeData() {
    this.addressInfo = this.checkoutService.addressData;
    this.title = this.addressInfo.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.addressData = this.addressInfo.dialog_address || {};
  }

  initForm() {
    this.addressForm = new FormBuilder().group({
      recipient_email: [this.addressInfo.addressId ? this.addressData.recipient_email : '', this.emailRequired ? [Validators.required] : []],
      recipient_name: [this.addressInfo.addressId ? this.addressData.recipient_name : this.authService.userDetails.name, [
        Validators.required,
      ]],
      recipient_surname: [this.addressInfo.addressId ? this.addressData.recipient_surname : this.authService.userDetails.surname, [
        Validators.required,
      ]],
      recipient_national_id: [this.addressInfo.addressId ? this.addressData.recipient_national_id : this.authService.userDetails.national_id, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/)
      ]],
      province: [this.addressInfo.addressId ? this.addressData.province : 'تهران'],
      city: [this.addressInfo.addressId ? this.addressData.city : 'تهران'],
      no: [this.addressInfo.addressId ? this.addressData.no : null, this.addressInfo.partEdit ? [] : [
        Validators.required,
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/),
      ]],
      unit: [this.addressInfo.addressId ? this.addressData.unit : null],
      postal_code: [this.addressInfo.addressId ? this.addressData.postal_code : null, this.addressInfo.partEdit ? [] : [
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/),
      ]],
      district: [this.addressInfo.addressId ? this.addressData.district : null, this.addressInfo.partEdit ? [] : [
        Validators.maxLength(500),
      ]],
      recipient_mobile_no: [this.addressInfo.addressId ? this.addressData.recipient_mobile_no : this.authService.userDetails.mobile_no, [
        Validators.required,
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/),
        Validators.minLength(8),
      ]],
      recipient_title: [this.addressInfo.addressId ? this.addressData.recipient_title : this.authService.userDetails.gender],
      latitude: [this.addressData.loc && this.addressInfo.addressId ? this.addressData.loc.lat : 35.696491],
      longitude: [this.addressData.loc && this.addressInfo.addressId ? this.addressData.loc.long : 51.379926],
      street: [this.addressInfo.addressId ? this.addressData.street : null, this.addressInfo.partEdit ? [] : [
        Validators.required,
      ]],
    });


    this.addressForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error('Error when subscribing on address form valueChanges: ', er)
    );
  }

  submitAddress() {
    this.addressData.loc = {
      long: this.addressForm.controls['longitude'].value,
      lat: this.addressForm.controls['latitude'].value,
    };
    Object.keys(this.addressForm.controls)
      .filter(r => !['latitude', 'longitude'].includes(r))
      .forEach(k => {
        if (k.startsWith('recipient') || !this.addressInfo.partEdit) {
          this.addressData[k] = this.addressForm.controls[k].value;
        }
      });

    console.log(this.addressData);
    if (this.withDelivery) {
      this.checkoutService.submitAddresses(this.addressData)
        .then(() => {
          this.checkoutService.addedProvince = this.addressData.province;
          this.onClose();
        })
        .catch(err => {
          console.error('error occured in submitting address', err);
        });
    } else {
      this.checkoutService.ccRecipientData = this.addressData;
      this.onClose();
    }
  }

  setNewProvince(newProvince) {
    const province = this.provinceArray.find(el => el.name === newProvince);
    if (province) {
      this.cityArray = province.cities;
      this.addressForm.controls['city'].setValue(this.cityArray[0]);
    }
  }

  getLatitude() {
    return this.addressForm.controls['latitude'].value;
  }

  getLongitude() {
    return this.addressForm.controls['longitude'].value;
  }

  setMarker(data) {
    this.addressForm.controls['latitude'].setValue(data.coords.lat);
    this.addressForm.controls['longitude'].setValue(data.coords.lng);
  }

  setButtonVisibility() {
    if (this.addressInfo.partEdit) {
      return !this.addressForm.valid || !this.anyChanges;
    } else
      return !this.addressInfo.partEdit && (!this.addressForm.valid || !this.anyChanges);
  }

  fieldChanged() {
    if (!this.addressInfo.partEdit) {
      this.anyChanges =
        (this.addressData.loc && (this.addressData.loc.long !== this.addressForm.controls['longitude'].value
          || this.addressData.loc.lat !== this.addressForm.controls['latitude'].value))
        || Object.keys(this.addressForm.controls)
          .filter(k => !['latitude', 'longitude'].includes(k) && (k.startsWith('recipient') || !this.addressInfo.partEdit))
          .map(k => this.addressForm.controls[k].value !== null &&
            this.addressForm.controls[k].value !== undefined && this.addressData[k] !== this.addressForm.controls[k].value.trim())
          .reduce((a, b) => a || b, false);
    } else {
      this.anyChanges =
        Object.keys(this.addressForm.controls)
          .filter(k => (k.startsWith('recipient')))
          .map(k => this.addressForm.controls[k].value !== null &&
            this.addressForm.controls[k].value !== undefined && this.addressData[k] !== this.addressForm.controls[k].value.trim())
          .reduce((a, b) => a || b, false);
    }
  }

}
