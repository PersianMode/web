import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {WINDOW} from '../../../../shared/services/window.service';
import {MatDialog} from '@angular/material';
import {GenDialogComponent} from '../../../../shared/components/gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../../../shared/enum/dialog.components.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<boolean>();
  loginForm: FormGroup;
  dialogEnum = DialogEnum;
  seen = {};
  curFocus = null;

  constructor(private authService: AuthService, private router: Router,
    @Inject(WINDOW) private window, public dialog: MatDialog) {
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
      this.authService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)
        .then(data => {
          this.closeDialog.emit(true);
          this.router.navigate(['home']);
        })
        .catch(err => console.error('Cannot login: ', err));
    }
  }

  goToRegister() {
    if (this.window.innerWidth >= 960) {
      this.closeDialog.emit(true);
      this.dialog.open(GenDialogComponent, {
        width: '500px',
        data: {
          componentName: this.dialogEnum.register,
        }
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
}
