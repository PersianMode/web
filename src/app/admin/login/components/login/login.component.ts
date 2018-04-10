import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  seen = {};
  curFocus = null;

  showClerkWarehouses = false;

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
      loginAs: [0],
      warehouse_id: [],
      keep_me_login: [true],
    });
  }

  login() {
    if (this.loginForm.valid) {

      const warehouseId = this.loginForm.controls['warehouse_id'].value;

      this.authService.login(this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value,
        this.loginForm.controls['loginAs'].value,
        warehouseId)
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

  onChange(option) {
    this.showClerkWarehouses = (option === AccessLevel.ShopClerk.toString());
    if (this.showClerkWarehouses && this.authService.warehouses && this.authService.warehouses.length)
      this.loginForm.controls['warehouse_id'].setValue(this.authService.warehouses.find(x => !x.is_center)._id);
    else if (option === AccessLevel.SalesManager.toString())
      this.loginForm.controls['warehouse_id'].setValue(this.authService.warehouses.find(x => x.is_center)._id);
    else
      this.loginForm.controls['warehouse_id'].setValue(null);
  }

}
