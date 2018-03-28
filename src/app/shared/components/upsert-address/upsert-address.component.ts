import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-upsert-address',
  templateUrl: './upsert-address.component.html',
  styleUrls: ['./upsert-address.component.css']
})
export class UpsertAddressComponent implements OnInit {
  dialogTitle;
  buttonTitle;
  addressData:any;
  addressForm: FormGroup;
  cityArray = [];
  ostanArray = [
    {
      'value': 'Tehran',
      'name': 'تهران',
      'cityArray': ['پردیس', 'شاهدشهر']
    },
    {
      'value': 'Qom',
      'name': 'قم',
      'cityArray': ['پردیسان', 'مهدیه']
    }
  ]

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<UpsertAddressComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.dialogTitle = this.data.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.buttonTitle = this.data.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.addressData = this.data.dialog_address;
    console.log(this.addressData);
    this.initForm();
  }

  initForm() {
    this.addressForm = new FormBuilder().group({
      name:  [this.data.addressId ? this.addressData.recipient_name : 'logged in user', [
        Validators.required,
      ]],
      family:  [this.data.addressId ? this.addressData.recipient_name : 'loged in user', [
        Validators.required,
      ]],
      nationalCode :  [this.data.addressId ? this.addressData.recipient_national_id : 'test code', [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]],
      selectOstan : [null],
      selectCity: [null],
      pelak: [this.data.addressId ? this.addressData.no : null],
      unit_no: [this.data.addressId ? this.addressData.unit : null],
      post_code: [this.data.addressId ? this.addressData.postal_code : null],
      address: [null, [
        Validators.maxLength(15),
      ]],
      phoneNumber: [this.data.addressId ? this.addressData.recipient_mobile_no : 'test phone number', [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      latitude: [this.data.addressId ? this.addressData.loc.lat : 35.696491],
      longitude: [this.data.addressId ? this.addressData.loc.long : 51.379926],
      street: [this.data.addressId ? this.addressData.street : null]
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitAddress() {
  }

  setNewOstan(newOstan) {
    this.cityArray = this.ostanArray.find(el => el.value === newOstan).cityArray;
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
  addAddress() {
  }
}
