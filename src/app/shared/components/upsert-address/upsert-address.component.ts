import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CheckoutService} from '../../services/checkout.service';
import {IAddressInfo} from '../../interfaces/iaddressInfo.interface';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-upsert-address',
  templateUrl: './upsert-address.component.html',
  styleUrls: ['./upsert-address.component.css']
})
export class UpsertAddressComponent implements OnInit {
  @Input() isNotMobile;
  @Output() closeDialog = new EventEmitter<boolean>();

  addressForm: FormGroup;
  cityArray = [];
  provinceArray: any;

  title;
  addressData: any;
  addressInfo: IAddressInfo;

  constructor(private authService: AuthService, private http: HttpClient,
              private checkoutService: CheckoutService, private router: Router) {
  }

  ngOnInit() {
    if (!this.isNotMobile) {
      // TODO: should scroll up the first time it entered this page
    }

    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.provinceArray = info;
        if (!this.addressInfo.addressId)
          this.cityArray = this.provinceArray.find(el => el.name === 'آذربایجان شرقی').cities;
        else
          this.cityArray = this.provinceArray.find(el => el.name === this.addressData.province).cities;
      }, err => {
        console.log('err: ', err);
      }
    );
    // this.addressForm.get('selectProvince').disable();
    this.addressInfo = this.checkoutService.addressData;
    this.initializeData();
    this.initForm();
  }

  onClose() {
    // TODO: guard is needed if any fields have been changed!
    if (this.isNotMobile) {
      this.closeDialog.emit(false);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  initializeData() {
    this.addressInfo = this.checkoutService.addressData;
    // console.log("address info:", this.addressInfo);
    this.title = this.addressInfo.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.addressData = this.addressInfo.dialog_address || {};
    // console.log("initial address data ", this.addressData);
  }

  initForm() {
    this.addressForm = new FormBuilder().group({
      name: [this.addressInfo.addressId ? this.addressData.recipient_name : this.authService.userDetails.name, [
        Validators.required,
      ]],
      family: [this.addressInfo.addressId ? this.addressData.recipient_name : this.authService.userDetails.surname, [
        Validators.required,
      ]],
      nationalCode: [this.addressInfo.addressId ? this.addressData.recipient_national_id : '1234567892', [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]],
      selectProvince: [this.addressInfo.addressId ? this.addressData.province : 'آذربایجان شرقی'],
      selectCity: [this.addressInfo.addressId ? this.addressData.city : 'آبش احمد'],
      pelak: [this.addressInfo.addressId ? this.addressData.no : null, [
        Validators.required,
      ]],
      unit: [this.addressInfo.addressId ? this.addressData.unit : null],
      postal_code: [this.addressInfo.addressId ? this.addressData.postal_code : null],
      district: [this.addressInfo.addressId ? this.addressData.district : null, [
        Validators.maxLength(15),
      ]],
      phoneNumber: [this.addressInfo.addressId ? this.addressData.recipient_mobile_no : this.authService.userDetails.mobile_no, [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      latitude: [this.addressInfo.addressId ? this.addressData.loc.lat : 35.696491],
      longitude: [this.addressInfo.addressId ? this.addressData.loc.long : 51.379926],
      street: [this.addressInfo.addressId ? this.addressData.street : null, [
        Validators.required,
      ]],
    });
  }

  submitAddress() {
    const tempName = this.addressForm.controls['name'].value + ' ' + this.addressForm.controls['family'].value;
    if (this.addressInfo.addressId) {
      Object.assign(this.addressData, {
        recipient_name: tempName,
        recipient_mobile_no: this.addressForm.controls['phoneNumber'].value,
        recipient_national_id: this.addressForm.controls['nationalCode'].value,
      });
    } else {
      Object.assign(this.addressData, {
        recipient_name: tempName,
        recipient_mobile_no: this.addressForm.controls['phoneNumber'].value,
        recipient_national_id: this.addressForm.controls['nationalCode'].value,
        province: this.addressForm.controls['selectProvince'].value,
        city: this.addressForm.controls['selectCity'].value,
        street: this.addressForm.controls['street'].value,
        no: this.addressForm.controls['pelak'].value,
        unit: this.addressForm.controls['unit'].value,
        postal_code: this.addressForm.controls['postal_code'].value,
        distinct: this.addressForm.controls['district'].value,
        loc: {
          long: this.addressForm.controls['longitude'].value,
          lat: this.addressForm.controls['latitude'].value,
        }
      });
    }
    // console.log("final address data are : ", this.addressData);
    // TODO: change checkoutService instead of this
    this.checkoutService.submitAddresses(this.addressData);
    // this.dialogRef.close(this.addressData);
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

  addAddress() {
  }
}
