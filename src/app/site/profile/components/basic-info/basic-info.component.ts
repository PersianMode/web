import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import * as moment from 'jalali-moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isUndefined} from 'util';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  @Input() isEdit = false;
  isChangePass = false;
  customerBasicInfo: any;
  userGender;
  userNationalId = '';
  birthDate: any = '';
  userInfoForm: FormGroup;
  changePassForm: FormGroup;
  nationalIdDisabled = false;
  anyChanges = false;
  formTitle = '';

  constructor(private authService: AuthService, private httpService: HttpService) {
  }

  ngOnInit() {
    this.formTitle = 'اطلاعات مشتری';
    this.customerBasicInfo = this.authService.userDetails;
    this.birthDate = moment(this.customerBasicInfo.dob).format('jYYYY-jMM-jDD');
    this.userNationalId = this.customerBasicInfo.national_id ? this.customerBasicInfo.national_id : '-';
    this.userGender = this.customerBasicInfo.gender === 'f' ? 'خانم ' : 'آقای ';
    this.nationalIdDisabled = this.userNationalId === '-' || !this.userNationalId ? false : true;
  }

  initForm() {
    this.userInfoForm = new FormBuilder().group({
      name: [this.customerBasicInfo.name ? this.customerBasicInfo.name : '', [
        Validators.required,
      ]],
      surname: [this.customerBasicInfo.surname ? this.customerBasicInfo.surname : '', [
        Validators.required,
      ]],
      dob: [this.customerBasicInfo.dob  ? moment(this.customerBasicInfo.dob).format('YYYY-MM-DD') : 'تاریخ تولد' , [
        Validators.required,
      ]],
      username: [this.customerBasicInfo.username, [
        Validators.required,
        Validators.email,
      ]],
      mobile_no: [this.customerBasicInfo.mobile_no, [
        Validators.required,
        Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
      ]],
      national_id: [this.customerBasicInfo.national_id ? this.customerBasicInfo.national_id : '', [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(/^[\u0660-\u06690-9\u06F0-\u06F9]+$/)
      ]],
    });
    this.userInfoForm.valueChanges.subscribe(
      (dt) => this.fieldChanged(),
      (er) => console.error('Error when subscribing on userInfo form valueChanges: ', er)
    );
  };

  goToEditForm() {
    this.isEdit = true;
    this.formTitle = 'ویرایش اطلاعات';
    this.initForm();
  }
  submitEditInfo() {
    this.customerBasicInfo.name = this.userInfoForm.controls['name'].value;
    this.customerBasicInfo.surname = this.userInfoForm.controls['surname'].value;
    this.customerBasicInfo.username = this.userInfoForm.controls['username'].value;
    this.customerBasicInfo.national_id = this.userInfoForm.controls['national_id'].value;
    this.customerBasicInfo.dob = moment(this.userInfoForm.controls['dob'].value, 'jYYYY-jMM-jDD').locale('en');
    this.authService.userDetails.displayName = this.customerBasicInfo.name + ' ' + this.customerBasicInfo.surname;
    this.authService.userDetails.name = this.customerBasicInfo.name;
    this.authService.userDetails.surname = this.customerBasicInfo.surname;
    this.authService.userDetails.national_id = this.customerBasicInfo.national_id;
    this.authService.userDetails.dob = this.customerBasicInfo.dob;
    this.authService.userDetails.username = this.customerBasicInfo.username;
    this.authService.isLoggedIn.next(true);
    this.httpService.post('editUserBasicInfo', this.customerBasicInfo).subscribe(
      (res) => {
        this.ngOnInit();
        this.isEdit = false;
      },
      (err) => {
        console.error('Cannot edit user info: ', err);
      }
    );
  }

  fieldChanged() {
    this.anyChanges = false;
    let name = (this.userInfoForm.controls['name'].value === null ||
      isUndefined(this.userInfoForm.controls['name'].value)) ? '' : this.userInfoForm.controls['name'].value;
    name = name.trim();

    let surname = (this.userInfoForm.controls['surname'].value === null ||
      isUndefined(this.userInfoForm.controls['surname'].value)) ? '' : this.userInfoForm.controls['surname'].value;
    surname = surname.trim();

    let username = (this.userInfoForm.controls['username'].value === null ||
      isUndefined(this.userInfoForm.controls['username'].value)) ? '' : this.userInfoForm.controls['username'].value;
    username = username.trim();

    let national_id = (this.userInfoForm.controls['national_id'].value === null ||
      isUndefined(this.userInfoForm.controls['national_id'].value)) ? '' : this.userInfoForm.controls['national_id'].value;
    national_id = national_id.trim();

    let dob = (this.userInfoForm.controls['dob'].value === null ||
      isUndefined(this.userInfoForm.controls['dob'].value)) ? '' : moment(this.userInfoForm.controls['dob'].value).format('jYYYY-jMM-jDD');

    if ((name !== this.customerBasicInfo.name && (name !== '' || this.customerBasicInfo.name !== null))
      || (surname !== this.customerBasicInfo.surname && (surname !== '' || this.customerBasicInfo.surname !== null))
      || (username !== this.customerBasicInfo.username && (username !== '' || this.customerBasicInfo.username !== null))
      || (dob !== moment(this.customerBasicInfo.dob).format('jYYYY-jMM-jDD'))
      || ((this.customerBasicInfo.national_id && national_id !== this.customerBasicInfo.national_id) || (isUndefined(this.customerBasicInfo.national_id) && national_id !== '')))
         this.anyChanges = true;
  }


  goToChangePassForm() {
    this.formTitle = 'تغییر کلمه عبور';
    this.isChangePass = true;
    this.initChangePassForm();
  }

  initChangePassForm() {
    this.formTitle = 'تغییر کلمه عبور';
    this.changePassForm = new FormBuilder().group({
      oldPass: [null],
      newPass: [null],
      retypePass: [null],
    });
  }
  submitNewPass() {
  }
  cancelEditOrChangePass() {
    this.ngOnInit();
    this.isEdit = false;
    this.isChangePass = false;
  }

  // showPass() {
  //   const x = document.getElementById('oldPassword');
  //   console.log('====>>', x.innerHTML);
  //   if (x.type === 'password') {
  //     x.type = 'text';
  //   } else {
  //     x.type = 'password';
  //   }
  // }
}
