import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {HttpClient} from '@angular/common/http';
import {isUndefined} from 'util';

@Component({
  selector: 'app-upsert-address',
  templateUrl: './upsert-address.component.html',
  styleUrls: ['./upsert-address.component.css']
})
export class UpsertAddressComponent implements OnInit {
  dialogTitle;
  buttonTitle;
  partEdit = false;
  addressData: any;
  addressForm: FormGroup;
  cityArray = [];
  provinceArray: any;
  anyChanges = false;
  gender = [{
      name : 'زن',
      value : 'f'
    }, {
      name : 'مرد',
      value : 'm'
    }]
  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<UpsertAddressComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService,
              private http: HttpClient, private httpService: HttpService) {
  }

  ngOnInit() {
    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.provinceArray = info;
        if (!this.data.addressId)
          this.cityArray = this.provinceArray.find(el => el.name === 'تهران').cities;
        else this.cityArray = this.provinceArray.find(el => el.name === this.addressData.province).cities;
      }, err => {
        console.log('err: ', err);
      }
    );
    this.dialogTitle = this.data.addressId !== null ? 'ویرایش آدرس' : 'افزودن آدرس جدید';
    this.buttonTitle = 'ثبت اطلاعات';
    this.addressData = this.data.dialog_address;
    this.partEdit = this.data.partEdit;
    this.initForm();
  }

  initForm() {
    this.addressForm = new FormBuilder().group({
      name: [this.data.addressId ? this.addressData.recipient_name : this.authService.userDetails.name, [
        Validators.required,
      ]],
      family: [this.data.addressId ? this.addressData.recipient_surname : this.authService.userDetails.surname, [
        Validators.required,
      ]],
      nationalCode: [this.data.addressId ? this.addressData.recipient_national_id : this.authService.userDetails.national_id, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]],
      selectProvince: [this.data.addressId ? this.addressData.province : 'تهران'],
      selectCity: [this.data.addressId ? this.addressData.city : 'تهران'],
      pelak: [this.data.addressId ? this.addressData.no : null, [
        Validators.required,
      ]],
      unit: [this.data.addressId ? this.addressData.unit : null],
      postal_code: [this.data.addressId ? this.addressData.postal_code : null],
      district: [this.data.addressId ? this.addressData.district : null, [
        Validators.maxLength(15),
      ]],
      phoneNumber: [this.data.addressId ? this.addressData.recipient_mobile_no : this.authService.userDetails.mobile_no, [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      selectGender: [this.data.addressId ? this.addressData.recipient_title : this.authService.userDetails.gender,
      ],
      latitude: [this.data.addressId ? this.addressData.loc.lat : 35.696491],
      longitude: [this.data.addressId ? this.addressData.loc.long : 51.379926],
      street: [this.data.addressId ? this.addressData.street : null, [
        Validators.required,
      ]],
    });


    this.addressForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error('Error when subscribing on address form valueChanges: ', er)
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitAddress() {
    if (this.data.addressId) {
      this.addressData.recipient_name = this.addressForm.controls['name'].value ;
      this.addressData.recipient_surname = this.addressForm.controls['family'].value;
      this.addressData.recipient_mobile_no = this.addressForm.controls['phoneNumber'].value;
      this.addressData.recipient_national_id = this.addressForm.controls['nationalCode'].value;
      this.addressData.recipient_title = this.addressForm.controls['selectGender'].value;
    } else {
      this.addressData.recipient_name = this.addressForm.controls['name'].value ;
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
    this.dialogRef.close(this.addressData);

  }

  setNewProvince(newProvince) {
    this.cityArray = this.provinceArray.find(el => el.name === newProvince).cities;
    this.addressData.province = newProvince;
  }

  setNewCity(newCity) {
    this.addressData.city = newCity;
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

  fieldChanged() {
    this.anyChanges = false;
    if (this.data.addressId) { //all fields of addressData has values
      let name = (this.addressForm.controls['name'].value === null ||
        isUndefined(this.addressForm.controls['name'].value)) ? '' : this.addressForm.controls['name'].value;
      name = name.trim();

      let family = (this.addressForm.controls['family'].value === null ||
        isUndefined(this.addressForm.controls['family'].value)) ? '' : this.addressForm.controls['family'].value;
      family = family.trim();

      let recipient_national_id = (this.addressForm.controls['nationalCode'].value === null ||
        isUndefined(this.addressForm.controls['nationalCode'].value)) ? '' : this.addressForm.controls['nationalCode'].value;

      let phoneNumber = (this.addressForm.controls['phoneNumber'].value === null ||
        isUndefined(this.addressForm.controls['phoneNumber'].value)) ? '' : this.addressForm.controls['phoneNumber'].value;

      let selectGender = (this.addressForm.controls['selectGender'].value === null ||
        isUndefined(this.addressForm.controls['selectGender'].value)) ? '' : this.addressForm.controls['selectGender'].value;

      if ((name !== this.addressData.recipient_name && (name !== '' || this.addressData.recipient_name !== null)) ||
        (family !== this.addressData.recipient_surname && (family !== '' || this.addressData.recipient_surname !== null)) ||
        (selectGender !== this.addressData.recipient_title && (selectGender !== '' || this.addressData.recipient_title !== null)) ||
        (recipient_national_id !== this.addressData.recipient_national_id && (recipient_national_id !== '' || this.addressData.recipient_national_id !== null))
      || (phoneNumber !== this.addressData.recipient_mobile_no && (phoneNumber !== '' || this.addressData.recipient_mobile_no !== null))) {
        this.anyChanges = true;
      }
    }
  }
}
