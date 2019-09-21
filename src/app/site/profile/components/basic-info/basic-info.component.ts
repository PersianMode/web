import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import * as moment from 'jalali-moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isUndefined } from 'util';
import { HttpService } from '../../../../shared/services/http.service';

import { GenDialogComponent } from '../../../../shared/components/gen-dialog/gen-dialog.component';
import { MatDialog } from '@angular/material';
import { DialogEnum } from '../../../../shared/enum/dialog.components.enum';
import { MatSnackBar } from '@angular/material';
import { ProgressService } from '../../../../shared/services/progress.service';
import { CheckoutService } from './../../../../shared/services/checkout.service';

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
  @Output('formTitle') formTitle = new EventEmitter();
  isChangePass = false;
  customerBasicInfo: any;
  userGender;
  userNationalId = '';
  birthDate: any = '';
  userInfoForm: FormGroup;
  changePassForm: FormGroup;
  nationalIdDisabled = false;
  anyChanges = false;
  title = '';
  seen = {};
  curFocus = null;
  changed_pass_obj = {
    old_pass: '',
    new_pass: '',
    retype_new_pass: ''
  };
  errorMsgOld = 'رمز عبور فعلی را وارد کنید (حداقل 8 کاراکتر)';
  errorMsgNew = 'رمز عبور جدید را وارد کنید (حداقل 8 کاراکتر)';
  errorMsgRetype = 'رمز عبور جدید را دوباره وارد کنید (حداقل 8 کاراکتر)';
  passCompatible = true;
  changedDob;
  changeDobFlag = false;
  balance = 0;
  active = false;
  loyaltyPoints = 0;
  loyaltyPointsValue = 0;
  balanceFa = '';
  loyaltyPointsFa = '';
  loyaltyPointsValueFa = '';
  dialogEnum = DialogEnum;


  constructor(private authService: AuthService, private httpService: HttpService,
    private snackBar: MatSnackBar, protected progressService: ProgressService, private dialog: MatDialog, private checkoutService: CheckoutService) {
  }

  ngOnInit() {
    this.checkBalance();
    this.anyChanges = false;
    this.changeDobFlag = false;
    this.customerBasicInfo = this.authService.userDetails;
    this.formatDob();
    this.userNationalId = this.customerBasicInfo.national_id ? this.customerBasicInfo.national_id : '-';
    this.userGender = this.customerBasicInfo.gender === 'f' ? 'خانم ' : 'آقای ';
    this.nationalIdDisabled = this.userNationalId === '-' || !this.userNationalId ? false : true;
    this.changedDob = this.customerBasicInfo.dob;
    this.title = 'اطلاعات کاربر';
    this.formTitle.emit(this.title);
    this.httpService.get(`customer/balance`).subscribe(res => {
      this.balance = res.balance;
      this.balanceFa = this.balance ? this.balance.toLocaleString('fa') : '-';
      this.loyaltyPointsFa = this.loyaltyPoints ? this.loyaltyPoints.toLocaleString('fa') : '-';
      this.loyaltyPointsValueFa = this.loyaltyPointsValue ? this.loyaltyPointsValue.toLocaleString('fa') : '-';
    });
  }

  private formatDob() {
    const dob = moment(this.customerBasicInfo.dob);
    this.birthDate = [dob.jDate(), dob.jMonth() + 1, dob.jYear()].map(r => r.toLocaleString('fa', { useGrouping: false })).join(' / ');
  }

  dobChange(dob) {
    this.changeDobFlag = false;
    this.changedDob = dob;
    // this.formatDob();
    if (moment(this.customerBasicInfo.dob).format('YYYY-MM-DD') !== moment(this.changedDob).format('YYYY-MM-DD')) {
      this.changeDobFlag = true;
    }
  }

  initForm() {
    this.userInfoForm = new FormBuilder().group({
      name: [this.customerBasicInfo.name ? this.customerBasicInfo.name : '', [
        Validators.required,
      ]],
      surname: [this.customerBasicInfo.surname ? this.customerBasicInfo.surname : '', [
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
    this.initForm();
    this.title = 'ویرایش اطلاعات';
    this.formTitle.emit(this.title);
  }

  submitEditInfo() {
    this.customerBasicInfo.name = this.userInfoForm.controls['name'].value;
    this.customerBasicInfo.surname = this.userInfoForm.controls['surname'].value;
    this.customerBasicInfo.username = this.userInfoForm.controls['username'].value;
    this.customerBasicInfo.national_id = this.userInfoForm.controls['national_id'].value;
    this.customerBasicInfo.dob = this.changedDob;
    this.authService.userDetails.displayName = this.customerBasicInfo.name + ' ' + this.customerBasicInfo.surname;
    this.authService.userDetails.name = this.customerBasicInfo.name;
    this.authService.userDetails.surname = this.customerBasicInfo.surname;
    this.authService.userDetails.national_id = this.customerBasicInfo.national_id;
    this.authService.userDetails.dob = this.customerBasicInfo.dob;
    this.authService.userDetails.username = this.customerBasicInfo.username;
    this.authService.isLoggedIn.next(this.authService.userDetails);
    this.httpService.post('editUserBasicInfo', this.customerBasicInfo).subscribe(
      (res) => {
        this.ngOnInit();
        this.isEdit = false;
        this.snackBar.open('اطلاعات شما با موفقیت ویرایش شد', null, {
          duration: 3200
        });
      },
      (err) => {
        console.error('Cannot edit user info: ', err);
        this.snackBar.open('سیستم قادر به ویرایش اطلاعات شما نیست، لطفا دوباره تلاش کنید', null, {
          duration: 3200
        });
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
    if ((name !== this.customerBasicInfo.name && (name !== '' || this.customerBasicInfo.name !== null))
      || (surname !== this.customerBasicInfo.surname && (surname !== '' || this.customerBasicInfo.surname !== null))
      || (username !== this.customerBasicInfo.username && (username !== '' || this.customerBasicInfo.username !== null))
      || ((national_id !== this.customerBasicInfo.national_id)
        || (isUndefined(this.customerBasicInfo.national_id) && national_id !== ''))) {
      this.anyChanges = true;
    }
  }

  goToChangePassForm() {
    this.errorMsgOld = 'رمز عبور فعلی را وارد کنید (حداقل 8 کاراکتر)';
    this.errorMsgNew = 'رمز عبور جدید را وارد کنید (حداقل 8 کاراکتر)';
    this.errorMsgRetype = 'رمز عبور جدید را دوباره وارد کنید (حداقل 8 کاراکتر)';
    this.isChangePass = true;
    this.initChangePassForm();
    Object.keys(this.changePassForm.controls).forEach(el => {
      this.seen[el] = false;
    });
    this.title = 'تغییر کلمه عبور';
    this.formTitle.emit(this.title);
  }

  initChangePassForm() {
    // TODO set form fields with change_pass_obj if they have value(instead of set null every time)
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
    this.changePassForm.valueChanges.subscribe(
      (dt) => this.checkCompatibilityOfNewPass(),
      (er) => console.error('Error when subscribing on userInfo form valueChanges: ', er)
    );
  }

  checkCompatibilityOfNewPass() {
    this.passCompatible = true;
    let newPass = (this.changePassForm.controls['newPass'].value === null ||
      isUndefined(this.changePassForm.controls['newPass'].value)) ? '' : this.changePassForm.controls['newPass'].value;
    newPass = newPass.trim();

    let retypePass = (this.changePassForm.controls['retypePass'].value === null ||
      isUndefined(this.changePassForm.controls['retypePass'].value)) ? '' : this.changePassForm.controls['retypePass'].value;
    retypePass = retypePass.trim();
    if (newPass !== null && retypePass !== null && newPass !== retypePass)
      this.passCompatible = false;
    else {
      this.passCompatible = true;
    }
  }

  setSeen(item) {
    this.errorMsgOld = 'رمز عبور فعلی را وارد کنید (حداقل 8 کاراکتر)';
    this.errorMsgNew = 'رمز عبور جدید را وارد کنید (حداقل 8 کاراکتر)';
    this.errorMsgRetype = 'رمز عبور جدید را دوباره وارد کنید (حداقل 8 کاراکتر)';
    this.seen[item] = true;
    this.curFocus = item;
  }

  submitNewPass() {
    this.changed_pass_obj.old_pass = this.changePassForm.controls['oldPass'].value;
    this.changed_pass_obj.new_pass = this.changePassForm.controls['newPass'].value;
    this.changed_pass_obj.retype_new_pass = this.changePassForm.controls['retypePass'].value;
    if ((this.changed_pass_obj.new_pass !== this.changed_pass_obj.retype_new_pass)
      || (this.changed_pass_obj.old_pass === this.changed_pass_obj.new_pass)) {
      this.errorMsgOld = 'اطلاعات جهت تغییر کلمه عبور درست وارد نشده است';
      this.errorMsgNew = this.errorMsgOld;
      this.errorMsgRetype = this.errorMsgOld;
      Object.keys(this.changePassForm.controls).forEach(el => {
        this.seen[el] = true;
        this.curFocus = null;
      });
      this.initChangePassForm();
      console.error('Cannot change user pass, new entered pass are not compatible: ');
    } else {
      this.progressService.enable();
      this.httpService.post('changePassword', this.changed_pass_obj).subscribe(
        (res) => {
          this.ngOnInit();
          this.isEdit = false;
          this.isChangePass = false;
          this.snackBar.open('رمز عبور شما با موفقیت تغییر کرد', null, {
            duration: 3200
          });
          this.progressService.disable();
        },
        (err) => {
          this.errorMsgOld = 'اطلاعات جهت تغییر کلمه عبور درست وارد نشده است';
          this.errorMsgNew = this.errorMsgOld;
          this.errorMsgRetype = this.errorMsgOld;
          console.error('Cannot change user pass: ', err);
          Object.keys(this.changePassForm.controls).forEach(el => {
            this.seen[el] = true;
            this.curFocus = null;
          });
          this.initChangePassForm();
          this.progressService.disable();
        }
      );
    }
  }

  cancelEditOrChangePass() {
    this.ngOnInit();
    this.isEdit = false;
    this.isChangePass = false;
    if (this.changePassForm)
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

  checkBalance() {
    this.httpService.get(`refund/get_balance`).subscribe(res => {
      this.balance = res[0].balance;
      this.active = res[1] && res[1].active;
    });
  }

  goToRefundBank() {
    const refundForm = this.dialog.open(GenDialogComponent, {
      width: '500px',
      data: {
        componentName: this.dialogEnum.refundBank,
      }
    });
    refundForm.afterClosed().subscribe(data => {
      if (data === true) {
        this.balance = 0;
        this.active = true;
        this.balanceFa = this.balance.toLocaleString('fa');
      }
    });

  }

  async requestForLoyalty() {
    try {
      this.progressService.enable();
      const res: any = await this.checkoutService.getLoyaltyBalance();
      this.loyaltyPoints = res.loyaltyPoint || '-';
      this.loyaltyPointsFa = this.loyaltyPoints.toLocaleString('fa');
    } catch (error) {

    }
    this.progressService.disable()
  }
}
