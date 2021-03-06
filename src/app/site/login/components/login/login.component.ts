import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, VerificationErrors} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';
import {HttpService} from '../../../../shared/services/http.service';
import {DictionaryService} from '../../../../shared/services/dictionary.service';
import {LoginStatus} from '../../login-status.enum';
import {MessageService} from '../../../../shared/services/message.service';
import {SpinnerService} from '../../../../shared/services/spinner.service';
import {MessageType} from '../../../../shared/enum/messageType.enum';

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
  mobileHasError = false;
  mobile_no = null;

  // Preferences
  gender = null;
  is_preferences_set;
  shoesUS = [];
  productType = 'footwear';
  brandsType = [];
  tagsType = [];
  shoesSize;
  preferences = {
    preferred_size: null,
    preferred_brands: [],
    preferred_tags: [],
    username: null
  };

  constructor(private authService: AuthService, private router: Router,
    @Inject(WINDOW) private window, public dialog: MatDialog, private httpService: HttpService,
    private dict: DictionaryService, private messageService: MessageService,
    private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.initForm();
    this.getTagTypes();
  }

  getTagTypes() {
    this.spinnerService.enable();
    this.httpService.get('tags/Category').subscribe(tags => {
      this.spinnerService.disable();
      tags.forEach(el => {
        this.tagsType.push({name: this.dict.translateWord(el.name.trim()), '_id': el._id});
      });
    }, err => {
      this.spinnerService.disable();
      console.log('error of get tags');
    });
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
      this.tryLoggingIn()
        .catch(err => {
          // there are two possibilities here
          // one is that the user is not verified yet, and another is that the credentials are invalid
          console.error('cannot login: ', err);
          switch (err.status) {
            case VerificationErrors.notMobileVerified.status:
              this.loginStatus = LoginStatus.VerifiedEmail;
              this.messageService.showMessage(VerificationErrors.notMobileVerified.error, MessageType.Error);
              break;
            case VerificationErrors.notEmailVerified.status:
              this.loginStatus = LoginStatus.VerifiedMobile;
              this.messageService.showMessage(VerificationErrors.notEmailVerified.error, MessageType.Error);
              break;
            default:
              this.loginStatus = null;
              this.messageService.showMessage('خطا به هنگام ورود' ,MessageType.Error);
              this.authService.tempUserData = {};
              break;
          }
        });
    }
  }

  outRouteOnPreferencesCondition(iPS, g) {
    if (iPS)
      this.is_preferences_set = iPS;
    if (g)
      this.gender = g;

    if (this.is_preferences_set) {
      this.closeDialog.emit(true);
      this.router.navigate(['home']);
    } else {
      this.loginStatus = LoginStatus.PreferenceTags;
      this.is_preferences_set = true;
    }
  }

  goToLoginPage() {
    this.loginStatus = this.Status.Login;
  }

  resendEmailActivationCode() {
    this.spinnerService.enable();
    this.httpService.post('user/auth/link', {
      username: this.authService.tempUserData['username'],
      is_forgot_mail: false,
    }).subscribe(
      data => {
        this.spinnerService.disable();
        this.messageService.showMessage('کد فعال سازی به موبایلتان ارسال شد', MessageType.Information);
      }, err => {
        this.spinnerService.disable();
        this.messageService.showMessage('خطا در ارسال کد', MessageType.Information);
        console.error('error in sending activation code: ', err);
      }
    );
  }

  resendCode() {
    this.spinnerService.enable();
    this.httpService.post('register/resend', {
      username: this.authService.tempUserData['username'],
    }).subscribe(
      (data) => {
        this.spinnerService.disable();
        this.messageService.showMessage('کد فعال سازی به موبایلتان ارسال شد', MessageType.Information);
      },
      (err) => {
        this.spinnerService.disable();
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
    this.spinnerService.enable();
    this.httpService.post('register/verify', {
      username: this.authService.tempUserData['username'],
      code: this.code,
    }).subscribe(
      (data) => {
        if (this.loginStatus === this.Status.VerifiedEmail) { // came from google login
          this.authService.checkValidation(this.router.url)
            .then(userData => {
              this.outRouteOnPreferencesCondition(userData['is_preferences_set'], userData['gender'] || 'm');
              this.spinnerService.disable();
            })
            .catch(err => {
              // might be real error
              // or
              // might close register page, activates via email, then enters the code in the login page
              // try the latter
              this.tryLoggingIn()
                .catch(error => {
                  this.spinnerService.disable();
                  this.closeDialog.emit(true);
                  this.router.navigate(['home']);
                });
            });
        } else {
          this.tryLoggingIn()
            .catch(err => {
              // correct code but not verified via email
              this.spinnerService.disable();
              this.loginStatus = this.Status.VerifiedMobile;
            });
        }
      },
      (err) => {
        // wrong verification code
        console.error('Cannot verify registration: ', err);
        this.spinnerService.disable();
        this.messageService.showMessage('کد ورودی اشتباه است', MessageType.Error);
      }
    );
  }

  tryLoggingIn() {
    this.spinnerService.enable();
    return new Promise((resolve, reject) => {
      this.authService.login(this.authService.tempUserData['username'] || this.loginForm.controls['username'].value,
        this.authService.tempUserData['password'] || this.loginForm.controls['password'].value)
        .then(userData => {
          this.spinnerService.disable();
          this.authService.tempUserData = {};
          this.outRouteOnPreferencesCondition(userData['is_preferences_set'], userData['gender'] || 'm');
          resolve();
        })
        .catch(err => {
          this.spinnerService.disable();
          reject(err);
        });
    });
  }

  addMobileNumber() { // only when came from google login
    if (this.mobile_no && !this.mobileHasError) {
      this.spinnerService.enable();
      this.authService.addMobileNumber(this.mobile_no)
        .then(data => {
          this.spinnerService.disable();
          this.loginStatus = this.Status.VerifiedEmail;
        })
        .catch(err => {
          this.spinnerService.disable();
          console.error('could not add mobile: ', err);
        });
    }
  }

  // Preferences
  setTags(tags) {
    this.preferences.preferred_tags = tags.selectedOptions.selected.map(item => item.value);
    this.httpService.get('../../../../../assets/shoesSize.json').subscribe(res => {
      this.shoesUS = [];
      if (this.gender === 'm') {
        res.men.forEach(element => {
          this.shoesUS.push({value: element['us'], disabled: false, displayValue: element['us']});
        });
      } else {
        res.women.forEach(element => {
          this.shoesUS.push({value: element['us'], disabled: false, displayValue: element['us']});
        });
      }
      this.shoesSize = this.shoesUS;

      // set brands in here so we don't need to wait in the next step
      this.httpService.get('brand').subscribe(brands => {
        this.brandsType = [];
        brands.forEach(el => {
          this.brandsType.push({name: this.dict.translateWord(el.name.trim()), '_id': el._id});
        });
      });
    });
    this.loginStatus = this.Status.PreferenceSize;
  }

  setSize() {
    this.loginStatus = this.Status.PreferenceBrand;
  }

  selectedSize(event) {
    this.preferences.preferred_size = event;
  }


  setBrand(brands) {
    this.preferences.preferred_brands = brands.selectedOptions.selected.map(item => item.value);
    // this API should be called anyway to disable the setting preferences steps
    this.httpService.post(`customer/preferences`, {
      preferred_brands: this.preferences.preferred_brands,
      preferred_tags: this.preferences.preferred_tags,
      preferred_size: this.preferences.preferred_size
    }).subscribe(response => {
      this.closeDialog.emit(true);
      this.router.navigate(['home']);
    }, err => {
      console.error('error occurred in submitting preferences: ', err);
    });
  }

  backToSetSize() {
    this.loginStatus = this.Status.PreferenceSize;
  }

  backToSetTags() {
    this.loginStatus = this.Status.PreferenceTags;
  }

  checkMobilePattern() {
    if ((/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).test(this.mobile_no))
      this.mobileHasError = false;
    else
      this.mobileHasError = true;
  }
}
