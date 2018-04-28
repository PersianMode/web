import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {ProgressService} from '../../../../shared/services/progress.service';
import {MatSnackBar} from '@angular/material';

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

  constructor(private authService: AuthService,
    private router: Router,
    private progressService: ProgressService,
    private snakBar: MatSnackBar) {
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

      let warehouseId;

      if (+this.loginForm.controls['loginAs'].value === AccessLevel.SalesManager ||
        +this.loginForm.controls['loginAs'].value === AccessLevel.ShopClerk) {
        warehouseId = this.loginForm.controls['warehouse_id'].value;
        if (!warehouseId) {
          this.openSnackBar('فروشگاه مورد نظر را انتخاب کنید');
          return;
        }
      }
      this.progressService.enable();
      this.authService.login(this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value,
        this.loginForm.controls['loginAs'].value,
        warehouseId)
        .then(data => {
          this.progressService.disable();
          switch (parseInt(this.loginForm.controls['loginAs'].value, 10)) {
            case 0:
              this.router.navigate(['/agent/collections']);
              break;
            case 1:
              this.router.navigate(['/agent/orders']);
              break;
            case 2:
              this.router.navigate(['/agent/orders']);
              break;

          }
        })
        .catch(err => {
          this.progressService.disable();
          this.openSnackBar('نام کاربری یا کلمه عبور نادرست می باشد');
        });
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

  onWarehouseChange(warehouseId) {
    this.loginForm.controls['warehouse_id'].setValue(warehouseId);
  }

  onChange(option) {
    this.showClerkWarehouses = (option === AccessLevel.ShopClerk.toString());
    if (this.showClerkWarehouses && this.authService.warehouses && this.authService.warehouses.length)
      this.loginForm.controls['warehouse_id'].setValue(this.getClerkWarehouses()[0]._id);
    else if (option === AccessLevel.SalesManager.toString())
      this.loginForm.controls['warehouse_id'].setValue(this.authService.warehouses.find(x => x.is_center)._id);
    else
      this.loginForm.controls['warehouse_id'].setValue(null);
  }

  getClerkWarehouses() {
    return this.authService.warehouses.filter(x => !x.is_center)
      .sort((a, b) => a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0);
  }

  openSnackBar(message: string) {
    this.snakBar.open(message, null, {
      duration: 2000,
    });
  }
}
