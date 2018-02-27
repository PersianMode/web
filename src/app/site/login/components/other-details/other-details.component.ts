import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';

enum StatusEnum {
  details,
  verify,
}

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.css']
})
export class OtherDetailsComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();

  statusEnum = StatusEnum;
  curStatus = StatusEnum.details;
  mobile_no = null;
  mobileHasError = false;
  code = null;

  constructor(private httpService: HttpService, private authService: AuthService) {
  }

  ngOnInit() {
  }

  addMobileNumber() {
    if (this.mobile_no && !this.mobileHasError) {
      this.httpService.post('register/mobile', {
        username: this.authService.userDetails.username,
        mobile_no: this.mobile_no,
      }).subscribe(
        (data) => {
          this.curStatus = this.statusEnum.verify;
        },
        (err) => {
          console.error('Cannot set mobile number');
        }
      );
    }
  }

  checkCode() {
    this.httpService.post('register/verify', {
      username: this.authService.userDetails.username,
      code: this.code,
    }).subscribe(
      (data) => {
        this.closeDialog.emit(true);
      },
      (err) => {
        console.error('Cannot verify code: ', err);
      }
    );
  }

  resendCode() {
    this.httpService.post('register/resend', {
      username: this.authService.userDetails.username,
      code: this.code,
    }).subscribe(
      (data) => {
        console.log('New code is sent: ', data);
      },
      (err) => {
        console.error('Cannot send new code: ', err);
      }
    );
  }

  checkMobilePattern() {
    if ((/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).test(this.mobile_no))
      this.mobileHasError = false;
    else
      this.mobileHasError = true;
  }
}
