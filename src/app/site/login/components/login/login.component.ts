import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormBuilder().group({
      email: [null, [
        Validators.required,
        Validators.email,
      ]],
      password: [null, [
        Validators.required,
      ]],
      keep_me_login: [true]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
        .then(
          (data) => {
            this.closeDialog.emit(true);
            this.router.navigate(['home']);
          },
          (err) => {
            console.error('Cannot login');
          }
        );
    }
  }

  goToRegister() {

  }
}
