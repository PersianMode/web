import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {AuthService, VerificationErrors} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {HttpService} from '../../../../shared/services/http.service';

export enum LoginStatus {
  Login = 'Login',
  ActivatingLink = 'ActivatingLink',  // which means the status that someone has confirmed their email
  InvalidLink = 'InvalidLink',        // which means the status that someone used an invalid link
  NotVerified = 'NotVerified',        // which means the status that nothing has been verified!
  VerifiedMobile = 'VerifiedMobile',  // which means the status that mobile has been verified
  VerifiedEmail = 'VerifiedEmail',    // which means the status that email has been verified
  VerifiedBoth = 'VerifiedBoth',      // which means the status that both things has been verified
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<boolean>();
  @Input() loginStatus: LoginStatus = LoginStatus.Login;
  loginForm: FormGroup;
  dialogEnum = DialogEnum;
  seen = {};
  curFocus = null;
  Status = LoginStatus;
  code = null;

  constructor(private authService: AuthService, private router: Router,
              @Inject(WINDOW) private window, public dialog: MatDialog,
              private snackBar: MatSnackBar, private httpService: HttpService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormBuilder().group({
      username: [null, [
        Validators.required,
      ]],
      password: [null, [
        Validators.required,
      ]],
      keep_me_login: [true]
    });
  }

  checkUsername(AC: AbstractControl) {
    const username = AC.get('username').value;
    let isMatched = false;
    if (username) {
      if (username.includes('@')) {
        isMatched = (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(username);
      } else {
        isMatched = (/^[\u0660-\u06690-9\u06F0-\u06F9]+$/).test(username);
      }
    }

    if (!isMatched) {
      AC.get('username').setErrors({match: 'not matched to any type'});
    } else {
      AC.get('username').setErrors(null);
      return null;
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.tempUserData = {
        username: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value,
      };
      this.authService.login(this.authService.tempUserData['username'], this.authService.tempUserData['password'])
        .then(data => {
          this.authService.tempUserData = {};
          this.closeDialog.emit(true);
          this.router.navigate(['home']);
        })
        .catch(err => {
          // there are two possibilities here
          // one is that the user is not verified yet, and another is that the credentials are invalid

          // here's where everything should take action :D
          switch (err.status) {
            case VerificationErrors.notVerified.status:
              this.loginStatus = LoginStatus.NotVerified;
              break;
            case VerificationErrors.notMobileVerified.status:
              this.loginStatus = LoginStatus.VerifiedEmail;
              break;
            case VerificationErrors.notEmailVerified.status:
              this.loginStatus = LoginStatus.VerifiedMobile;
              break;
            default:
              console.error('cannot login: ', err);
              this.authService.tempUserData = {};
              break;
          }
        });
    }
  }

  goToLoginPage() {
    this.loginStatus = this.Status.Login;
  }

  resendEmailActivationCode() {
    this.httpService.post('user/auth/link', {
      username: this.authService.tempUserData['username'],
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

  resendCode() {
    this.httpService.post('register/resend', {
      username: this.authService.tempUserData['username'],
    }).subscribe(
      (data) => {
        this.snackBar.open('کد فعال سازی به موبایلتان ارسال شد', null, {duration: 2300});
      },
      (err) => {
        console.error('Cannot send new verification code: ', err);
      }
    );
  }

  goToRegister() {
    if (this.window.innerWidth >= 960) {
      this.closeDialog.emit(false);
      const regDialog = this.dialog.open(GenDialogComponent, {
        width: '500px',
        data: {
          componentName: this.dialogEnum.register,
        }
      });
      regDialog.afterClosed().subscribe(data => {
        this.router.navigate(['home']);
      });
    } else {
      this.router.navigate(['register']);
    }
  }

  keyPress(e) {
    const code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) {
      this.login();
    }
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  forgotPassword() {
    if (this.window.innerWidth >= 960) {
      this.closeDialog.emit(true);
      this.dialog.open(GenDialogComponent, {
        width: '500px',
        data: {
          componentName: this.dialogEnum.forgotPassword,
        },
      });
    } else {
      this.router.navigate(['forgot/password']);
    }
  }

  checkCode() {
    this.httpService.post('register/verify', {
      username: this.authService.tempUserData['username'],
      code: this.code,
    }).subscribe(
      (data) => {
        this.authService.login(this.authService.tempUserData['username'], this.authService.tempUserData['password'])
          .then(res => {
            this.closeDialog.emit(true);
          })
          .catch(err => {
            // correct code but not verified via email
            this.loginStatus = this.Status.VerifiedMobile;
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
