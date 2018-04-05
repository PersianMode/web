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

  warehouses: any[] = [];
  isShopClerk = false;

  constructor(private authService: AuthService, private router: Router, private restService: HttpService) {
  }

  ngOnInit() {
    this.initForm();
    this.restService.get('warehouse/all').subscribe(res => {
      this.warehouses = res.filter(x => !x.is_center);
    });
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

      let warehouseId = null;
      if (this.isShopClerk)
        warehouseId = this.loginForm.controls['warehouse_id'].value;

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
    this.isShopClerk = option === AccessLevel.ShopClerk.toString();
    if (this.isShopClerk && this.warehouses && this.warehouses.length)
      this.loginForm.controls['warehouse_id'].setValue(this.warehouses[0]._id);
    else
      this.loginForm.controls['warehouse_id'].setValue(null);
  }

}
