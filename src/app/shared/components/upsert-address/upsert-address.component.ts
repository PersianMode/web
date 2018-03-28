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
  addressData: object = {};
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
    this.dialogTitle = this.data.addressId !== null ? 'ویرایش آدرس' : 'افزودن آدرس جدید';
    this.buttonTitle = this.data.addressId !== null ? 'ویرایش آدرس' : 'افزودن آدرس جدید';
    this.addressData = this.data.dialog_address;
    this.initForm();
  }

  initForm() {
    this.addressForm = new FormBuilder().group({
      name:  [null, [
        Validators.required,
      ]],
      family:  [null, [
        Validators.required,
      ]],
      nationalCode :  [null, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]],
      selectOstan : [null],
      selectCity: [null],
      pelak: [null],
      unit_no: [null],
      post_code: [null],
      address: [null, [
        Validators.maxLength(500),
      ]],
      phoneNumber: [null, [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      latitude: [35.696491],
      longitude: [51.379926],
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
