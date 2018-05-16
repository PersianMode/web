import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'jalali-moment';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';

enum RegStatus {
  Register = 'Register',
  Verify = 'Verify',
  PreferenceSize = 'PreferenceSize',
  PreferenceBrand = 'PreferenceBrand',
  PreferenceTags = 'PreferenceTags',
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  sizeSelected;
  brandSelected;
  tagsSelected;
  brandsType;
  brandsFromServer = [{
    _id : '5af95c12867a8527085f471d',
    name : 'Nike',
  }, {
    _id : '5af95c12867a8527085f471e',
    name : 'Puma',
  }, {
    _id : '5af95c12867a8527085f4720',
    name : 'Addidas',
  }];
  tagsType;
  tagsFromServer = [{
    _id : '5af95c12867a8527085f471d',
    name : 'CAPS',
  }, {
    _id : '5af95c12867a8527085f471e',
    name : 'BEANIE',
  }, {
    _id : '5af95c12867a8527085f4720',
    name : 'DUFFEL BAGS',
  }, {
    _id : '5af95c12867a8527085f4722',
    name : 'BACKPACK',
  }];
  sizesFromServer = [
    {value: '10', disabled: false, displayValue: '۱۰'},
    {value: '11', disabled: false, displayValue: '۱۱'},
    {value: '6', disabled: false, displayValue: '۶'},
    {value: '7', disabled: false, displayValue: '۷'},
    {value: '8', disabled: false, displayValue: '۸'},
    {value: '9', disabled: false, displayValue: '۹'}
  ];
  preferences = {
    size: null,
    brands: [],
    tags: []
  };

  @Output() closeDialog = new EventEmitter<boolean>();
  dob = null;
  dateObject = null;
  registerForm: FormGroup;
  gender = null;
  seen: any = {};
  curFocus = null;
  regStatus = RegStatus;
  curStatus = RegStatus.Register;
  code = null;

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
        Validators.minLength(8),
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
    return this.curStatus = this.regStatus.Verify;
    // if (this.registerForm.valid && this.gender) {
    //   let data: any = {};
    //   Object.keys(this.registerForm.controls).forEach(el => data[el] = this.registerForm.controls[el].value);
    //   data.gender = this.gender;
    //   data.dob = this.dob;
    //   this.httpService.put('register', data).subscribe(
    //     (res) => {
    //       this.curStatus = this.regStatus.Verify;
    //     },
    //     (err) => {
    //       console.error('Cannot register user: ', err);
    //     }
    //   );
    // } else {
    //   Object.keys(this.registerForm.controls).forEach(el => {
    //     if (!this.registerForm.controls[el].valid) {
    //       this.seen[el] = true;
    //     }
    //   });

    //   if (!this.gender) {
    //     this.seen['gender'] = true;
    //   }
    // }
  }

  changeDob(date) {
    this.dob = date;
    this.registerForm.controls['dob'].setValue(date);
    this.seen.dob = true;
    this.curFocus = 'dob';
  }

  resendCode() {
    this.httpService.post('register/resend', {
      username: this.registerForm.controls['username'].value,
      code: this.code
    }).subscribe(
      (data) => {
        console.log('New code is sent: ', data);
      },
      (err) => {
        console.error('Cannot send new code: ', err);
      }
    );
  }

  backToRegister() {
    this.curStatus = this.regStatus.Register;
  }

  checkCode() {
    return this.curStatus = this.regStatus.PreferenceSize;
    // this.httpService.post('register/verify', {
    //   code: this.code,
    //   username: this.registerForm.controls['username'].value,
    // }).subscribe(
    //   (data) => {
    //     this.curStatus = this.regStatus.PreferenceSize;
    //     this.authService.login(this.registerForm.controls['username'].value, this.registerForm.controls['password'].value)
    //       .then(res => {
    //         this.closeDialog.emit(true);
    //       })
    //       .catch(err => {
    //         console.error('Cannot login: ', err);
    //       });
    //   },
    //   (err) => {
    //     console.error('Cannot verify registration: ', err);
    //   }
    // );
  }

  setSize() {
    this.tagsType = this.tagsFromServer;
    return this.curStatus = this.regStatus.PreferenceTags;
  }

  selectedSize(event) {
    this.preferences.size = event;
  }

  setTags(tags) {
    this.preferences.tags = tags.selectedOptions.selected.map(item => item.value);
    this.brandsType = this.brandsFromServer;
    return this.curStatus = this.regStatus.PreferenceBrand;
  }

  setBrand(brands) {
    this.preferences.brands = brands.selectedOptions.selected.map(item => item.value);
    console.log('------->', this.preferences);
  }

  backToCheckCode() {
    return this.curStatus = this.regStatus.Verify;
  }

  backToSetSize() {
    return this.curStatus = this.regStatus.PreferenceSize;
  }

  backToSetTags() {
    return this.curStatus = this.regStatus.PreferenceTags;
  }
}
