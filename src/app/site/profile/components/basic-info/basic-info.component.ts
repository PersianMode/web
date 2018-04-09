import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import * as moment from 'jalali-moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  @Input() isEdit = false;
  customerBasicInfo: any;
  userGender;
  userTel = '';
  paymentCartNumber = '';
  userNationalId = '';
  birthDate = '';
  yesNo = 'هستید';
  userInfoForm: FormGroup;
  gender = [{
    name: 'خانم',
    value: 'f'
  }, {
    name: 'آقا',
    value: 'm'
  }];
  seen = {};
  curFocus = null;
  nationalIdDisabled = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.customerBasicInfo = this.authService.userDetails;
    this.birthDate = moment(this.customerBasicInfo.dob).format('YYYY-MM-DD');
    this.userNationalId = this.customerBasicInfo.national_id ? this.customerBasicInfo.national_id : '-';
    this.userGender = this.customerBasicInfo.gender === 'f' ? 'زن' : 'مرد';
    this.userTel = this.customerBasicInfo.tel ? this.customerBasicInfo.tel : '-';
    this.paymentCartNumber = this.customerBasicInfo.paymentCartNumber ? this.customerBasicInfo.paymentCartNumber : '-';
    this.yesNo = this.customerBasicInfo.gender === 'f' ? 'هستید' : 'نیستید';
    this.nationalIdDisabled = this.userNationalId !== '-' ? true : false;
    this.initForm();
  }

  initForm() {
    this.userInfoForm = new FormBuilder().group({
      name: [this.customerBasicInfo.name ? this.customerBasicInfo.name : '', [
        Validators.required,
      ]],
      surname: [this.customerBasicInfo.surname ? this.customerBasicInfo.surname : '', [
        Validators.required,
      ]],
      gender: [this.customerBasicInfo.gender ? this.customerBasicInfo.gender : ''],
      dob: [this.birthDate ? this.birthDate : 'تاریخ تولد'],
      username : [this.customerBasicInfo.username],
      mobile_no : [this.customerBasicInfo.mobile_no],
      national_id : [this.customerBasicInfo.national_id ? this.customerBasicInfo.national_id : ''],
      userTel : [this.customerBasicInfo.userTel ? this.customerBasicInfo.userTel : ''],
    });
    // this.userInfoForm.valueChanges.subscribe(
    //   (dt) => this.fieldChanged(),
    //   (er) => console.error('Error when subscribing on address form valueChanges: ', er)
    // );
    };

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }
  goToEditForm() {
    this.isEdit = true;
  }

  submitEditInfo() {
  }
}
