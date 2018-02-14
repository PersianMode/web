import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  seen = {};
  curFocus = null;

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
      keep_me_login: [true],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
        .then(data => {
          this.router.navigate(['/agent/collections']);
        })
        .catch(err => console.error('Cannot login: ', err));
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
}
