import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'jalali-moment';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {DictionaryService} from '../../../../shared/services/dictionary.service';


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
  shoesUS = [];
  productType = 'footwear';
  sizeSelected;
  brandSelected;
  tagsSelected;
  brandsType = [];
  tagsType = [];
  shoesSize;
  preferences = {
    preferred_size: null,
    preferred_brands: [],
    preferred_tags: [],
    username: null
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

  constructor(private httpService: HttpService, private authService: AuthService, private dict: DictionaryService) {
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
    if (this.registerForm.valid && this.gender) {
      let data: any = {};
      Object.keys(this.registerForm.controls).forEach(el => data[el] = this.registerForm.controls[el].value);
      data.gender = this.gender;
      data.dob = this.dob;
      this.httpService.put('register', data).subscribe(
        (res) => {
          this.curStatus = this.regStatus.Verify;
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
    this.httpService.get('tags/Category').subscribe(tags => {
      tags.forEach(el => {
        this.tagsType.push({name: this.dict.translateWord(el.name.trim()), '_id': el._id});
      });
    });
    this.httpService.post('register/verify', {
      code: this.code,
      username: this.registerForm.controls['username'].value,
    }).subscribe(
      (data) => {
        this.preferences.username = this.registerForm.controls['username'].value;
        this.curStatus = this.regStatus.PreferenceTags;
        // login service
      },
      (err) => {
        console.error('Cannot verify registration: ', err);
      }
    );
  }

  setTags(tags) {
    this.preferences.preferred_tags = tags.selectedOptions.selected.map(item => item.value);
    this.httpService.get('../../../../../assets/shoesSize.json').subscribe(res => {
      if (this.gender === 'm') {
        res.men.forEach(element => {
          this.shoesUS.push({value: element['us'], disabled: false, displayValue:  element['us']});
        });
      } else {
        res.women.forEach(element => {
          this.shoesUS.push({value: element['us'], disabled: false, displayValue:  element['us']});
        });
      }
      this.shoesSize = this.shoesUS;
    });
    return this.curStatus = this.regStatus.PreferenceSize;
  }

  setSize() {
    this.httpService.get('brand').subscribe(brands => {
      brands.forEach(el => {
        this.brandsType.push({name: this.dict.translateWord(el.name.trim()), '_id': el._id});
      });
    });
    return this.curStatus = this.regStatus.PreferenceBrand;
  }

  selectedSize(event) {
    console.log('selectedSize', event);
    this.preferences.preferred_size = event;
  }


  setBrand(brands) {
    this.preferences.preferred_brands = brands.selectedOptions.selected.map(item => item.value);
    this.httpService.post(`customer/preferences`, {
      username: this.preferences.username,
      preferred_brands: this.preferences.preferred_brands,
      preferred_tags: this.preferences.preferred_tags,
      preferred_size: this.preferences.preferred_size
    }).subscribe(response => {
      this.authService.login(this.registerForm.controls['username'].value, this.registerForm.controls['password'].value)
      .then(res => {
        this.closeDialog.emit(true);
      })
      .catch(err => {
        console.error('Cannot login: ', err);
      });
    });
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
