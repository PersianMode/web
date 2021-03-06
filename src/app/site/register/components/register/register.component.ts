import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'jalali-moment';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService, VerificationErrors} from '../../../../shared/services/auth.service';
import {DictionaryService} from '../../../../shared/services/dictionary.service';

import {MatDialog} from '@angular/material';
import {WINDOW} from '../../../../shared/services/window.service';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {LoginStatus} from '../../../login/login-status.enum';
import {Router} from '@angular/router';
import {RegStatus} from '../../register-status.enum';
import {MessageService} from '../../../../shared/services/message.service';
import {SpinnerService} from '../../../../shared/services/spinner.service';
import {MessageType} from '../../../../shared/enum/messageType.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<boolean>();
  dob = null;
  dateObject = null;
  registerForm: FormGroup;
  gender = null;
  seen: any = {};
  curFocus = null;
  regStatus = RegStatus;
  curStatus = RegStatus.Register;
  code = null;
  dialogEnum = DialogEnum;

  constructor(private httpService: HttpService, private authService: AuthService,
              private dict: DictionaryService, @Inject(WINDOW) private window, public dialog: MatDialog,
              private router: Router, private messageService: MessageService, private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.dateObject = moment(new Date()).format('jYYYY,jMM,jDD');
    this.initForm();
  }

  initForm() {
    this.registerForm = new FormBuilder().group({
      username: [null, [
        Validators.required,
        Validators.email,
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
      ]],
      first_name: [null, [
        Validators.required,
      ]],
      surname: [null, [
        Validators.required,
      ]],
      dob: [null, [
        Validators.required,
      ]],
      mobile_no: [null, [
        Validators.required,
        Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
      ]],
    });
  }

  setGender(g) {
    this.gender = g;
    this.seen['gender'] = true;
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  register() {
    if (this.registerForm.valid && this.gender) {
      const data: any = {};
      Object.keys(this.registerForm.controls).forEach(el => data[el] = this.registerForm.controls[el].value);
      data.gender = this.gender;
      data.dob = this.dob;
      this.spinnerService.enable();
      this.httpService.put('register', data).subscribe(
        (res) => {
          this.curStatus = this.regStatus.Verify;
          this.spinnerService.disable();
        },
        (err) => {
          console.error('Cannot register user: ', err);
          this.spinnerService.disable();
          if (err.error === 'customer already exist')
            this.messageService.showMessage('کاربری با این مشخصات موجود است', MessageType.Error);
          else
            this.messageService.showMessage('در حال حاضر ثبت نام در سایت امکان پذیر نیست، لطفا دوباره تلاش کنید', MessageType.Error);
        }
      );
    } else {
      Object.keys(this.registerForm.controls).forEach(el => {
        if (!this.registerForm.controls[el].valid) {
          this.seen[el] = true;
        }
      });

      if (!this.gender) {
        this.seen['gender'] = true;
      }
    }
  }

  changeDob(date) {
    this.dob = date;
    this.registerForm.controls['dob'].setValue(date);
    this.seen.dob = true;
    this.curFocus = 'dob';
  }

  resendCode() {
    this.spinnerService.enable();
    this.httpService.post('register/resend', {
      username: this.registerForm.controls['username'].value,
    }).subscribe(
      (data) => {
        this.spinnerService.disable();
        this.messageService.showMessage('کد فعال سازی به موبایلتان ارسال شد', MessageType.Information);
      },
      (err) => {
        this.spinnerService.disable();
        console.error('Cannot send new verification code: ', err);
        this.messageService.showMessage('خطایی در ارسال مجدد کد رخ داده است، دوباره تلاش کنید', MessageType.Information);
      }
    );
  }

  resendEmailActivationCode() {
    this.spinnerService.enable();
    this.httpService.post('user/auth/link', {
      username: this.registerForm.controls['username'].value,
      is_forgot_mail: false,
    }).subscribe(
      data => {
        this.spinnerService.disable();
        this.messageService.showMessage('لینک فعال سازی با موفقیت ارسال شد', MessageType.Information);
      }, err => {
        this.spinnerService.disable();
        this.messageService.showMessage('خطایی در ارسال لینک فعال سازی رخ داده است', MessageType.Error);
        console.error('error in sending activation code: ', err);
      }
    );
  }

  backToRegister() {
    this.curStatus = this.regStatus.Register;
  }

  checkCode() {
    this.spinnerService.enable();
    this.httpService.post('register/verify', {
      username: this.registerForm.controls['username'].value,
      code: this.code,
    }).subscribe(
      (data) => {
        this.spinnerService.disable();
        this.authService.login(this.registerForm.controls['username'].value, this.registerForm.controls['password'].value)
        // comes here when customer activates via email BEFORE activating mobile, which rarely happens!
        // this way, they get logged in and the next time they try logging in, they will be setting preferences
          .then(userObj => {
            if (userObj['is_preferences_set']) {
              this.closeDialog.emit(true);
              return;
            }

            if (this.window.innerWidth >= 960) {
              const rmDialog = this.dialog.open(GenDialogComponent, {
                width: '500px',
                data: {
                  componentName: this.dialogEnum.login,
                  extraData: {
                    loginStatus: LoginStatus.PreferenceTags
                  }
                }
              });
              rmDialog.afterOpen().subscribe(() => {
                this.closeDialog.emit(false);
              });
              rmDialog.afterClosed().subscribe(resp => {
                if (resp) {
                  this.closeDialog.emit(true);
                  this.router.navigate(['home']);
                }
              });
            } else {
              this.router.navigate(['../login/oauth/setPreferences']);
            }
          })
          // the usual way is verifying through mobile, but email is stayed put for later
          // so depending on status code, we can understand that customer is verified by mobile or not
          .catch(err => {
            this.spinnerService.disable();
            if (err.status === VerificationErrors.notEmailVerified.status) {
              // mobile activated
              this.messageService.showMessage('لطفا برای فعال سازی حساب کابری به ایمیل خود مراجعه کنید ', MessageType.Information);
              this.curStatus = this.regStatus.MobileRegistered;
            } else {
              this.messageService.showMessage('خطا در هنگام ورود رخ داده است', MessageType.Error);
              // wrong verification code
              console.error('error in logging in:', err);
            }
          });
      },
      (err) => {
        // wrong verification code
        this.spinnerService.disable();
        this.messageService.showMessage('کد فعال سازی نادرست است', MessageType.Error);
        console.error('Cannot verify registration: ', err);
      }
    );
  }
}
