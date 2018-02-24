import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'jalali-moment';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<boolean>();

  dateObject = null;
  registerForm: FormGroup;
  gender = null;
  seen = {};
  curFocus = null;

  constructor(private httpService: HttpService, private authService: AuthService) {
  }

  ngOnInit() {
    this.dateObject = moment(new Date()).format('jYYYY,jMM,jDD');
    this.initForm();
  }

  initForm() {
    this.registerForm = new FormBuilder().group({
      username: [null, [
        Validators.required,
        Validators.email,
      ]],
      password: [null, [
        Validators.required,
      ]],
      first_name: [null, [
        Validators.required,
      ]],
      surname: [null, [
        Validators.required,
      ]],
      dob: [null, [
        Validators.required,
      ]],
      mobile_no: [null, [
        Validators.required,
        Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
      ]],
    });
  }

  setGender(g) {
    this.gender = g;
    this.seen['gender'] = true;
  }

  setSeen(item) {
    this.seen[item] = true;
    this.curFocus = item;
  }

  register() {
    if (this.registerForm.valid && this.gender) {
      let data = {};
      Object.keys(this.registerForm.controls).forEach(el => data[el] = this.registerForm.controls[el].value);
      data['gender'] = this.gender;

      this.httpService.put('register', data).subscribe(
        (res) => {
          this.authService.login(this.registerForm.controls['username'].value, this.registerForm.controls['password'].value)
            .then(res => {
              this.closeDialog.emit(true);
            })
            .catch(err => {
              console.error('Cannot login: ', err);
            });
        },
        (err) => {
          console.error('Cannot register user: ', err);
        }
      );
    } else {
      Object.keys(this.registerForm.controls).forEach(el => {
        if (!this.registerForm.controls[el].valid) {
          this.seen[el] = true;
        }
      });

      if (!this.gender) {
        this.seen['gender'] = true;
      }
    }
  }
}
