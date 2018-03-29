import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CheckoutService} from '../../services/checkout.service';
import {IaddressInfo} from '../../interfaces/iaddressInfo.interface';

@Component({
  selector: 'app-upsert-address',
  templateUrl: './upsert-address.component.html',
  styleUrls: ['./upsert-address.component.css']
})
export class UpsertAddressComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<boolean>();

  dialogTitle;
  buttonTitle;
  addressData: any;
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
  ];
  _addressId;

  @Input() isNotMobile;

  addressInfo: IaddressInfo;

  constructor(private router: Router, private checkoutService: CheckoutService) {
  }

  ngOnInit() {
    if (!this.isNotMobile) {
      // TODO: should scroll up the first time it entered this page
    }

    this.addressInfo = this.checkoutService.addressData;
    this.initializeData();
    this.initForm();
  }

  onClose() {
    if (this.isNotMobile) {
      this.closeDialog.emit(false);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  initializeData() {
    this._addressId = this.addressInfo.addressId;
    this.dialogTitle = this.addressInfo.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.buttonTitle = this.addressInfo.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    // this.addressInfo.partEdit && this.addressInfo.fullEdit are also given
    this.addressData = this.addressInfo.dialog_address;
  }

  initForm() {
    console.log(this._addressId);
    this.addressForm = new FormBuilder().group({
      name: [this._addressId ? this.addressData.recipient_name : '', [
        Validators.required,
      ]],
      family: [this._addressId ? this.addressData.recipient_name : '', [
        Validators.required,
      ]],
      nationalCode: [this._addressId ? this.addressData.recipient_national_id : '', [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]],
      selectOstan: [null],
      selectCity: [null],
      pelak: [this._addressId ? this.addressData.no : null],
      unit_no: [this._addressId ? this.addressData.unit : null],
      post_code: [this._addressId ? this.addressData.postal_code : null],
      address: [null, [
        Validators.maxLength(500),
      ]],
      phoneNumber: [this._addressId ? this.addressData.recipient_mobile_no : '', [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      latitude: [this._addressId ? this.addressData.loc.lat : 35.696491],
      longitude: [this._addressId ? this.addressData.loc.long : 51.379926],
      street: [this._addressId ? this.addressData.street : null]
    });
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
