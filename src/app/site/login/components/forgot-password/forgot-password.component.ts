import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<boolean>();
  mobile_no = null;
  isFirstStage = true;
  chPassForm: FormGroup;
  seen = {};
  curFocus = null;

  constructor(private httpService: HttpService, private snackBar: MatSnackBar,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.initPassForm();
  }

  initPassForm() {
    this.chPassForm = new FormBuilder().group({
      code: [null, [
        Validators.required,
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
      ]],
      re_password: [null, [
        Validators.required,
      ]]
    }, {
        validator: this.matchPassword,
      });
  }

  private matchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    const confirmPassword = AC.get('re_password').value;
    if (password !== confirmPassword) {
      AC.get('re_password').setErrors({matchPassword: true});
    } else {
      AC.get('re_password').setErrors(null);
      return null;
    }
  }

  applyCode() {
    if (!this.mobile_no)
      return;

    this.httpService.post('forgot/password', {
      mobile_no: this.mobile_no,
    }).subscribe(
      (data) => {
        this.isFirstStage = false;
        this.snackBar.open('کد ارسال شد', null, {
          duration: 2300,
        });
      },
      (err) => {
        this.snackBar.open(
          err.status === 404 ? 'شماره وارد شده در سیستم یافت نشد' : 'قادر به ارسال کد نیستیم. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }

  keyPress(e) {
    const code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) {
      this.changePassword();
    }
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  changePassword() {
    if (!this.chPassForm.valid)
      return;

    this.httpService.post('forgot/set/password', {
      mobile_no: this.mobile_no,
      code: this.chPassForm.controls['code'].value,
      password: this.chPassForm.controls['password'].value,
    }).subscribe(
      (data) => {
        this.snackBar.open('رمز عبور به روزرسانی شد', null, {
          duration: 2300,
        });
        this.closeDialog.emit(true);
        this.dialog.open(GenDialogComponent, {
          width: '500px',
          data: {
            componentName: DialogEnum.login,
          }
        });
      },
      (err) => {
        this.snackBar.open('از درست بودن کد و رمز عبور اطمینان حاصل نمایید', null, {
          duration: 3200,
        });
      });
  }
}
