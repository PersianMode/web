import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-upsert-address',
  templateUrl: './upsert-address.component.html',
  styleUrls: ['./upsert-address.component.css']
})
export class UpsertAddressComponent implements OnInit {
  dialogTitle;
  buttonTitle;
  partEdit;
  addressData:any;
  addressForm: FormGroup;
  cityArray = ['آبش احمد'];
  ostanArray: any;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<UpsertAddressComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private http: HttpClient, private httpService: HttpService) {
  }

  ngOnInit() {
    this.http.get('assets/province.json').subscribe(
      (data: any) => {
        this.ostanArray = data;
      }, err => {
        console.log('err: ', err);
      }
    );

    this.dialogTitle = this.data.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.buttonTitle = this.data.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.addressData = this.data.dialog_address;
    this.partEdit = this.data.partEdit;
    this.initForm();
  }

  initForm() {
    this.addressForm = new FormBuilder().group({
      name:  [this.data.addressId ? this.addressData.recipient_name : this.authService.userDetails.name , [
        Validators.required,
      ]],
      family:  [this.data.addressId ? this.addressData.recipient_name : this.authService.userDetails.surname, [
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
      address: [this.data.addressId  ? this.addressData.district : null, [
        Validators.maxLength(15),
      ]],
      phoneNumber: [this.data.addressId ? this.addressData.recipient_mobile_no : this.authService.userDetails.mobile_no, [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      latitude: [this.data.addressId ? this.addressData.loc.lat : 40.696491],
      longitude: [this.data.addressId ? this.addressData.loc.long : 51.379926],
      street: [this.data.addressId ? this.addressData.street : null],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitAddress() {
  }

  setNewOstan(newOstan) {
    this.cityArray = this.ostanArray.find(el => el.name === newOstan).cities;
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
