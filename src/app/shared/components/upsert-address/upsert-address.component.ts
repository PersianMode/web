import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {CheckoutService} from '../../services/checkout.service';
import {IAddressInfo} from '../../interfaces/iaddressInfo.interface';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {isUndefined} from 'util';

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

  constructor(private authService: AuthService, private http: HttpClient,
              private checkoutService: CheckoutService, private router: Router,
              private location: Location) {
  }


  ngOnInit() {
    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.provinceArray = info;
        if (!this.addressInfo.addressId)
          this.cityArray = this.provinceArray.find(el => el.name === 'تهران').cities;
        else
          this.cityArray = this.provinceArray.find(el => el.name === this.addressData.province).cities;
      }, err => {
        console.log('err: ', err);
      }
    );
    this.addressInfo = this.checkoutService.addressData;
    this.initializeData();
    this.dialogTitle = this.addressInfo.addressId !== null ? 'ویرایش آدرس' : 'افزودن آدرس جدید';
    this.buttonTitle = 'ثبت اطلاعات';
    this.addressData = this.addressInfo.dialog_address;
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
      name: [this.addressInfo.addressId ? this.addressData.recipient_name : this.authService.userDetails.name, [
        Validators.required,
      ]],
      family: [this.addressInfo.addressId ? this.addressData.recipient_surname : this.authService.userDetails.surname, [
        Validators.required,
      ]],
      nationalCode: [this.addressInfo.addressId ? this.addressData.recipient_national_id : this.authService.userDetails.national_id, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/)
      ]],
      selectProvince: [this.addressInfo.addressId ? this.addressData.province : 'تهران'],
      selectCity: [this.addressInfo.addressId ? this.addressData.city : 'تهران'],
      pelak: [this.addressInfo.addressId ? this.addressData.no : null, [
        Validators.required,
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/),
      ]],
      unit: [this.addressInfo.addressId ? this.addressData.unit : null],
      postal_code: [this.addressInfo.addressId ? this.addressData.postal_code : null, [
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/),
      ]],
      district: [this.addressInfo.addressId ? this.addressData.district : null, [
        Validators.maxLength(500),
      ]],
      phoneNumber: [this.addressInfo.addressId ? this.addressData.recipient_mobile_no : this.authService.userDetails.mobile_no, [
        Validators.required,
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/),
        Validators.minLength(8),
      ]],
      selectGender: [this.addressInfo.addressId ? this.addressData.recipient_title : this.authService.userDetails.gender],
      latitude: [this.addressInfo.addressId ? this.addressData.loc.lat : 35.696491],
      longitude: [this.addressInfo.addressId ? this.addressData.loc.long : 51.379926],
      street: [this.addressInfo.addressId ? this.addressData.street : null, [
        Validators.required,
      ]],
    });


    this.addressForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error('Error when subscribing on address form valueChanges: ', er)
    );
  }

  submitAddress() {
    if (this.addressInfo.partEdit) {
      this.addressData.recipient_name = this.addressForm.controls['name'].value;
      this.addressData.recipient_surname = this.addressForm.controls['family'].value;
      this.addressData.recipient_mobile_no = this.addressForm.controls['phoneNumber'].value;
      this.addressData.recipient_national_id = this.addressForm.controls['nationalCode'].value;
      this.addressData.recipient_title = this.addressForm.controls['selectGender'].value;
    } else {
      this.addressData.recipient_name = this.addressForm.controls['name'].value;
      this.addressData.recipient_surname = this.addressForm.controls['family'].value;
      this.addressData.recipient_mobile_no = this.addressForm.controls['phoneNumber'].value;
      this.addressData.recipient_national_id = this.addressForm.controls['nationalCode'].value;
      this.addressData.recipient_title = this.addressForm.controls['selectGender'].value;
      this.addressData.province = this.addressForm.controls['selectProvince'].value;
      this.addressData.city = this.addressForm.controls['selectCity'].value;
      this.addressData.street = this.addressForm.controls['street'].value;
      this.addressData.no = this.addressForm.controls['pelak'].value;
      this.addressData.unit = this.addressForm.controls['unit'].value;
      this.addressData.postal_code = this.addressForm.controls['postal_code'].value;
      this.addressData.district = this.addressForm.controls['district'].value;
      this.addressData.loc = {
        long: this.addressForm.controls['longitude'].value,
        lat: this.addressForm.controls['latitude'].value,
      };
    }
    this.checkoutService.submitAddresses(this.addressData)
      .then(res => {
        this.onClose();
      })
      .catch(err => {
        console.error('error occured in submitting address', err);
      });
  }

  setNewProvince(newProvince) {
    this.cityArray = this.provinceArray.find(el => el.name === newProvince).cities;
    this.addressForm.controls['selectCity'].setValue(this.cityArray[0]);
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
    if (this.addressInfo.partEdit)
      return ((!this.addressForm.valid) || (this.addressInfo.partEdit && !this.anyChanges));
    else
      return ((!this.addressForm.valid) || (!this.anyChanges));
  }

  fieldChanged() {
    this.anyChanges = false;
    if (this.addressInfo.partEdit) {
      const name = ((this.addressForm.controls['name'].value === null ||
        isUndefined(this.addressForm.controls['name'].value)) ? '' : this.addressForm.controls['name'].value).trim();

      let family = (this.addressForm.controls['family'].value === null ||
        isUndefined(this.addressForm.controls['family'].value)) ? '' : this.addressForm.controls['family'].value;
      family = family.trim();

      const recipient_national_id = (this.addressForm.controls['nationalCode'].value === null ||
        isUndefined(this.addressForm.controls['nationalCode'].value)) ? '' : this.addressForm.controls['nationalCode'].value;

      const phoneNumber = (this.addressForm.controls['phoneNumber'].value === null ||
        isUndefined(this.addressForm.controls['phoneNumber'].value)) ? '' : this.addressForm.controls['phoneNumber'].value;

      const selectGender = (this.addressForm.controls['selectGender'].value === null ||
        isUndefined(this.addressForm.controls['selectGender'].value)) ? '' : this.addressForm.controls['selectGender'].value;

      if ((name !== this.addressData.recipient_name && (name !== '' || this.addressData.recipient_name !== null)) ||
        (family !== this.addressData.recipient_surname && (family !== '' || this.addressData.recipient_surname !== null)) ||
        (selectGender !== this.addressData.recipient_title && (selectGender !== '' || this.addressData.recipient_title !== null)) ||
        (recipient_national_id !== this.addressData.recipient_national_id &&
          (recipient_national_id !== '' || this.addressData.recipient_national_id !== null))
        || (phoneNumber !== this.addressData.recipient_mobile_no && (phoneNumber !== '' || this.addressData.recipient_mobile_no !== null))) {
        this.anyChanges = true;
      }
    } else {
      let name = (this.addressForm.controls['name'].value === null ||
        isUndefined(this.addressForm.controls['name'].value)) ? '' : this.addressForm.controls['name'].value;
      name = name.trim();

      let family = (this.addressForm.controls['family'].value === null ||
        isUndefined(this.addressForm.controls['family'].value)) ? '' : this.addressForm.controls['family'].value;
      family = family.trim();

      const recipient_national_id = (this.addressForm.controls['nationalCode'].value === null ||
        isUndefined(this.addressForm.controls['nationalCode'].value)) ? '' : this.addressForm.controls['nationalCode'].value;

      const phoneNumber = (this.addressForm.controls['phoneNumber'].value === null ||
        isUndefined(this.addressForm.controls['phoneNumber'].value)) ? '' : this.addressForm.controls['phoneNumber'].value;

      const selectGender = (this.addressForm.controls['selectGender'].value === null ||
        isUndefined(this.addressForm.controls['selectGender'].value)) ? '' : this.addressForm.controls['selectGender'].value;
      const selectProvince = (this.addressForm.controls['selectProvince'].value === null ||
        isUndefined(this.addressForm.controls['selectProvince'].value)) ? '' : this.addressForm.controls['selectProvince'].value;

      const selectCity = (this.addressForm.controls['selectCity'].value === null ||
        isUndefined(this.addressForm.controls['selectCity'].value)) ? '' : this.addressForm.controls['selectCity'].value;

      let street = (this.addressForm.controls['street'].value === null ||
        isUndefined(this.addressForm.controls['street'].value)) ? '' : this.addressForm.controls['street'].value;
      street = street.trim();

      let no = (this.addressForm.controls['pelak'].value === null ||
        isUndefined(this.addressForm.controls['pelak'].value)) ? '' : this.addressForm.controls['pelak'].value;
      no = no.trim();

      let unit = (this.addressForm.controls['unit'].value === null ||
        isUndefined(this.addressForm.controls['unit'].value)) ? '' : this.addressForm.controls['unit'].value;
      unit = unit.trim();

      let postal_code = (this.addressForm.controls['postal_code'].value === null ||
        isUndefined(this.addressForm.controls['postal_code'].value)) ? '' : this.addressForm.controls['postal_code'].value;
      postal_code = postal_code.trim();

      let district = (this.addressForm.controls['district'].value === null ||
        isUndefined(this.addressForm.controls['district'].value)) ? '' : this.addressForm.controls['district'].value;
      district = district.trim();

      const latitude = (this.addressForm.controls['latitude'].value === null ||
        isUndefined(this.addressForm.controls['latitude'].value)) ? '' : this.addressForm.controls['latitude'].value;

      const longitude = (this.addressForm.controls['longitude'].value === null ||
        isUndefined(this.addressForm.controls['longitude'].value)) ? '' : this.addressForm.controls['longitude'].value;

      if ((name !== this.addressData.recipient_name && (name !== '' || this.addressData.recipient_name !== null)) ||
        (family !== this.addressData.recipient_surname && (family !== '' || this.addressData.recipient_surname !== null)) ||
        (selectGender !== this.addressData.recipient_title && (selectGender !== '' || this.addressData.recipient_title !== null)) ||
        (recipient_national_id !== this.addressData.recipient_national_id &&
          (recipient_national_id !== '' || this.addressData.recipient_national_id !== null))
        || (phoneNumber !== this.addressData.recipient_mobile_no && (phoneNumber !== '' || this.addressData.recipient_mobile_no !== null))
        || (selectProvince !== this.addressData.province && (selectProvince !== '' || this.addressData.province !== null))
        || (selectCity !== this.addressData.city && (selectCity !== '' || this.addressData.city !== null))
        || (street !== this.addressData.street && (street !== '' || this.addressData.street !== null))
        || (no !== this.addressData.no && (no !== '' || this.addressData.no !== null))
        || (district !== this.addressData.district && (district !== '' || this.addressData.district !== null))
        || (unit !== this.addressData.unit && (unit !== '' || this.addressData.unit !== null))
        || (postal_code !== this.addressData.postal_code && (postal_code !== '' || this.addressData.postal_code !== null))
        || (latitude !== this.addressData.loc.lat && (latitude !== '' || this.addressData.loc.lat !== null))
        || (longitude !== this.addressData.loc.long && (longitude !== '' || this.addressData.loc.long !== null))) {
            this.anyChanges = true;
      }
    }
  }

}
