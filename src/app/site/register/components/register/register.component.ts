import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'jalali-moment';

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

  constructor() {
  }

  ngOnInit() {
    this.dateObject = moment('1395-11-22','jYYYY,jMM,jDD');
    this.initForm();
  }

  initForm() {
    this.registerForm = new FormBuilder().group({
      email: [null, [
        Validators.required,
        Validators.email,
      ]],
      password: [null, [
        Validators.required,
      ]],
      firstname: [null, [
        Validators.required,
      ]],
      surname: [null, [
        Validators.required,
      ]],
      birthdate: [null, [
        Validators.required,
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
      // raised event to close dialog after register successfully
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
