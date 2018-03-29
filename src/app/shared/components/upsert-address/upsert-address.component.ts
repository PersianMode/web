import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() closeDialog = new EventEmitter<boolean>();

  dialogTitle;
  buttonTitle;
  partEdit;
  addressData: any;
  addressForm: FormGroup;
  cityArray = [];
  ostanArray: any;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<UpsertAddressComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService,
              private http: HttpClient, private httpService: HttpService) {
  }

  ngOnInit() {
    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.ostanArray = info;
        if (!this.data.addressId)
          this.cityArray = this.ostanArray.find(el => el.name === 'آذربایجان شرقی').cities;
        else this.cityArray = this.ostanArray.find(el => el.name === this.addressData.ostan).cities;
      }, err => {
        console.log('err: ', err);
      }
    );
    this.dialogTitle = this.data.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.buttonTitle = this.data.addressId !== null ? 'ویرایش اطلاعات' : 'افزودن آدرس جدید';
    this.addressData = this.data.dialog_address;
    this.partEdit = this.data.partEdit;
    // this.addressForm.get('selectOsatn').disable();
    this.initForm();
  }

  onClose() {
    if (this.isNotMobile) {
      this.closeDialog.emit(false);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  initForm() {
    console.log(this._addressId);
    this.addressForm = new FormBuilder().group({
      name: [this.data.addressId ? this.addressData.recipient_name : this.authService.userDetails.name, [
        Validators.required,
      ]],
      family: [this.data.addressId ? this.addressData.recipient_name : this.authService.userDetails.surname, [
        Validators.required,
      ]],
      nationalCode: [this.data.addressId ? this.addressData.recipient_national_id : '1234567892', [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]],
      selectOstan: [this.data.addressId ? this.addressData.ostan : 'آذربایجان شرقی'],
      selectCity: [this.data.addressId ? this.addressData.city : 'آبش احمد'],
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
      latitude: [this.data.addressId ? this.addressData.loc.lat : 35.696491],
      longitude: [this.data.addressId ? this.addressData.loc.long : 51.379926],
      street: [this.data.addressId ? this.addressData.street : null, [
        Validators.required,
      ]],
    });
  }

  submitAddress() {
    const tempName = this.addressForm.controls['name'].value + ' ' + this.addressForm.controls['family'].value;
    if (this.data.addressId) {
      this.addressData.recipient_name = tempName;
      this.addressData.recipient_mobile_no = this.addressForm.controls['phoneNumber'].value;
      this.addressData.recipient_national_id = this.addressForm.controls['nationalCode'].value;
    } else {
      this.addressData.recipient_name = tempName;
      this.addressData.recipient_mobile_no = this.addressForm.controls['phoneNumber'].value;
      this.addressData.recipient_national_id = this.addressForm.controls['nationalCode'].value;
      this.addressData.ostan = this.addressForm.controls['selectOstan'].value;
      this.addressData.city = this.addressForm.controls['selectCity'].value;
      this.addressData.street = this.addressForm.controls['street'].value;
      this.addressData.no = this.addressForm.controls['pelak'].value;
      this.addressData.unit = this.addressForm.controls['unit'].value;
      this.addressData.postal_code = this.addressForm.controls['postal_code'].value;
      this.addressData.distinct = this.addressForm.controls['district'].value;
      this.addressData.loc = {
        long: this.addressForm.controls['longitude'].value,
        lat: this.addressForm.controls['latitude'].value,
      };
    }
    this.dialogRef.close(this.addressData);
  }

  setNewOstan(newOstan) {
    this.cityArray = this.ostanArray.find(el => el.name === newOstan).cities;
    this.addressData.ostan = newOstan;
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
