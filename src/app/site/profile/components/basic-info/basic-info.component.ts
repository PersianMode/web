import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('old_pass') oldPass: ElementRef;
  @ViewChild('new_pass') newPass: ElementRef;
  @ViewChild('retype_pass') retypePass: ElementRef;
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
  seen = {};
  curFocus = null;
  changeed_pass_obj = {
    old_pass: '',
    new_pass: '',
    retype_new_pass: ''
  }
  errorMsgOld = 'رمز عبور فعلی را وارد کنید (حداقل 8 کاراکتر)';
  errorMsgNew = 'رمز عبور جدید را وارد کنید (حداقل 8 کاراکتر)';
  errorMsgRetype = 'رمز عبور جدید را دوباره وارد کنید (حداقل 8 کاراکتر)'
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
      dob: [this.customerBasicInfo.dob ? moment(this.customerBasicInfo.dob).format('jYYYY-jMM-jDD') : 'تاریخ تولد', [
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
    // console.log('--->> :', moment(this.customerBasicInfo.dob).format('jYYYY-jMM-jDD'));
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
    // console.log('***', this.customerBasicInfo);
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
    this.errorMsgOld = 'رمز عبور فعلی را وارد کنید (حداقل 8 کاراکتر)';
    this.errorMsgNew = 'رمز عبور جدید را وارد کنید (حداقل 8 کاراکتر)';
    this.errorMsgRetype = 'رمز عبور جدید را دوباره وارد کنید (حداقل 8 کاراکتر)';
    this.formTitle = 'تغییر کلمه عبور';
    this.isChangePass = true;
    this.initChangePassForm();
    Object.keys(this.changePassForm.controls).forEach(el => {
      this.seen[el] = false;
    });
  }

  initChangePassForm() {
    // TODO set form fiels with change_pass_obj if they have value(insted of set null every time)
    this.formTitle = 'تغییر کلمه عبور';
    this.changePassForm = new FormBuilder().group({
      oldPass: [null, [
        Validators.required,
        Validators.minLength(8),
      ]],
      newPass: [null, [
        Validators.required,
        Validators.minLength(8),
      ]],
      retypePass: [null, [
        Validators.required,
        Validators.minLength(8),
      ]],
    });
  }

  setSeen(item) {
    this.errorMsgOld = 'رمز عبور فعلی را وارد کنید (حداقل 8 کاراکتر)';
    this.errorMsgNew = 'رمز عبور جدید را وارد کنید (حداقل 8 کاراکتر)';
    this.errorMsgRetype = 'رمز عبور جدید را دوباره وارد کنید (حداقل 8 کاراکتر)';
    this.seen[item] = true;
    this.curFocus = item;
  }

  submitNewPass() {
    this.changeed_pass_obj.old_pass = this.changePassForm.controls['oldPass'].value;
    this.changeed_pass_obj.new_pass = this.changePassForm.controls['newPass'].value;
    this.changeed_pass_obj.retype_new_pass = this.changePassForm.controls['retypePass'].value;
    if (this.changeed_pass_obj.new_pass !== this.changeed_pass_obj.retype_new_pass) {
      this.errorMsgOld = 'اطلاعات جهت تغییر کلمه عبور درست وارد نشده است';
      this.errorMsgNew = this.errorMsgOld;
      this.errorMsgRetype = this.errorMsgOld;
      Object.keys(this.changePassForm.controls).forEach(el => {
        this.seen[el] = true;
        this.curFocus = null;
      });
      this.initChangePassForm();
      console.error('Cannot change user pass, new entered pass are not compatible: ');
      return;
    }
    this.httpService.post('changePassword', this.changeed_pass_obj).subscribe(
      (res) => {
        this.ngOnInit();
        this.isEdit = false;
        this.isChangePass = false;
      },
      (err) => {
        this.errorMsgOld = 'اطلاعات جهت تغییر کلمه عبور درست وارد نشده است';
        this.errorMsgNew = this.errorMsgOld;
        this.errorMsgNew = this.errorMsgOld;
        console.error('Cannot change user pass: ', err);
        Object.keys(this.changePassForm.controls).forEach(el => {
          this.seen[el] = true;
          this.curFocus = null;
        });
        this.initChangePassForm();
      }
    );
  }

  cancelEditOrChangePass() {
    this.ngOnInit();
    this.isEdit = false;
    this.isChangePass = false;
    Object.keys(this.changePassForm.controls).forEach(el => {
      this.seen[el] = false;
    });
  }

  showPass(value) {
    if (this.oldPass.nativeElement.type === 'password') {
      this.oldPass.nativeElement.type = 'text';
    } else {
      this.oldPass.nativeElement.type = 'password';
    }
  }

  showNewPass() {
    if (this.newPass.nativeElement.type === 'password') {
      this.newPass.nativeElement.type = 'text';
    } else {
      this.newPass.nativeElement.type = 'password';
    }
  }

  showRetypePass() {
    if (this.retypePass.nativeElement.type === 'password') {
      this.retypePass.nativeElement.type = 'text';
    } else {
      this.retypePass.nativeElement.type = 'password';
    }
  }
}
