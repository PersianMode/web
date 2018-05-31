import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'jalali-moment';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material';

enum RegStatus {
  Register = 'Register',
  Verify = 'Verify',
  MobileRegistered = 'MobileRegistered',
};

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

  constructor(private httpService: HttpService, private authService: AuthService,
              private snackBar: MatSnackBar) {
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
      this.httpService.put('register', data).subscribe(
        (res) => {
          this.curStatus = this.regStatus.Verify;
        },
        (err) => {
          console.error('Cannot register user: ', err);
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
    this.httpService.post('register/resend', {
      username: this.registerForm.controls['username'].value,
      // code: this.code
    }).subscribe(
      (data) => {
        this.snackBar.open('کد فعال سازی به موبایلتان ارسال شد', null, {duration: 2300});
      },
      (err) => {
        console.error('Cannot send new verification code: ', err);
      }
    );
  }

  resendEmailActivationCode() {
    this.httpService.post('user/auth/link', {
      username: this.registerForm.controls['username'].value,
      is_forgot_mail: false,
    }).subscribe(
      data => {
        this.snackBar.open('کد فعال سازی با موفقیت ارسال شد', null, {duration: 2300});
      }, err => {
        this.snackBar.open('خطا در ارسال کد', null, {duration: 1000});
        console.error('error in sending activation code: ', err);
      }
    );
  }

  backToRegister() {
    this.curStatus = this.regStatus.Register;
  }

  checkCode() {
    this.httpService.post('register/verify', {
      code: this.code,
      username: this.registerForm.controls['username'].value,
    }).subscribe(
      (data) => {
        this.authService.login(this.registerForm.controls['username'].value, this.registerForm.controls['password'].value)
          .then(res => {
            this.closeDialog.emit(true);
          })
          .catch(err => {
            // correct code but not verified via email
            this.curStatus = this.regStatus.MobileRegistered;
            // console.error('Cannot login: ', err);
          });
      },
      (err) => {
        // wrong verification code
        console.error('Cannot verify registration: ', err);
      }
    );
  }
}
