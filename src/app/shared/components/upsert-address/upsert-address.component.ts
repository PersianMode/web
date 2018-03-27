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
      'cityArray': ['پردیسان', 'شکوهیه']
    }
  ]

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<UpsertAddressComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.dialogTitle = this.data.addressId !== null ? 'ویرایش آدرس' : 'افزودن آدرس جدید';
    this.addressData = this.data.dialog_address;
    this.initForm();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitAddress() {
  }

  setNewOstan(newOstan) {
    this.cityArray = this.ostanArray.find(el => el.value === newOstan).cityArray;
  }

  initForm() {
    this.addressForm = new FormBuilder().group({
      name: [null],
      family: [null],
      nationalCode : [null],
      selectOstan : [null],
      selectCity: [null],
      pelak: [null],
      unit_no: [null],
      post_code: [null],
      address: [null, [
        Validators.maxLength(500),
      ]],
    });
  }
}
