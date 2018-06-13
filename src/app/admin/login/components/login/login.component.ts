import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {ProgressService} from '../../../../shared/services/progress.service';
import {MatSnackBar} from '@angular/material';
import {TitleService} from '../../../../shared/services/title.service';

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
    private snakBar: MatSnackBar, private titleService: TitleService) {
  }

  ngOnInit() {
    this.initForm();
    this.titleService.setTitleWithOutConstant('ورود ادمین');

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

      if (+this.loginForm.controls['loginAs'].value === AccessLevel.ShopClerk) {
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

          if (parseInt(this.loginForm.controls['loginAs'].value, 10) === 0)
            this.router.navigate(['/agent/collections']);
          else
            this.router.navigate(['/agent/orders']);
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

    if (this.authService.warehouses && this.authService.warehouses.length) {
      if (option === AccessLevel.ShopClerk.toString()) {
        this.showClerkWarehouses = true;
        this.loginForm.controls['warehouse_id'].setValue(this.getClerkWarehouses()[0]._id);
      }
      else if (option === AccessLevel.HubClerk.toString()) {
        this.showClerkWarehouses = false;
        this.loginForm.controls['warehouse_id'].setValue(this.getClerkWarehouses().find(x => x.is_hub));
      }
      else{
        this.showClerkWarehouses = false;
        this.loginForm.controls['warehouse_id'].setValue(null);
      }
    }
  }

  getClerkWarehouses() {
    return this.authService.warehouses.sort((a, b) => a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0);
  }

  openSnackBar(message: string) {
    this.snakBar.open(message, null, {
      duration: 2000,
    });
  }
}
