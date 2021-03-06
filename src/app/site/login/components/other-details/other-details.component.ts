import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SpinnerService} from '../../../../shared/services/spinner.service';

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

  @Input()
  set status(value) {
    if (value && value.toLowerCase() === 'verify')
      this.curStatus = this.statusEnum.verify;
    else
      this.curStatus = this.statusEnum.details;
  }

  statusEnum = StatusEnum;
  curStatus = StatusEnum.details;
  mobile_no = null;
  mobileHasError = false;
  code = null;

  constructor(private httpService: HttpService, private authService: AuthService,
              private route: ActivatedRoute, private router: Router,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        if (params['status'] && params['status'].toLowerCase() === 'verify')
          this.curStatus = this.statusEnum.verify;
        else
          this.curStatus = this.statusEnum.details;
      }
    );
  }

  addMobileNumber() {
    if (this.mobile_no && !this.mobileHasError) {
      this.spinnerService.enable();
      this.httpService.post('register/mobile', {
        username: this.authService.userDetails.username,
        mobile_no: this.mobile_no,
      }).subscribe(
        data => {
          this.spinnerService.disable();
          this.curStatus = this.statusEnum.verify;
        },
        err => {
          this.spinnerService.disable();
          console.error('Cannot set mobile number');
        }
      );
    }
  }

  checkCode() {
    this.spinnerService.enable();
    this.httpService.post('register/verify', {
      username: this.authService.userDetails.username,
      code: this.code,
    }).subscribe(
      (data) => {
        this.spinnerService.disable();
        this.authService.isVerified.next(true);
        this.closeDialog.emit(true);
        this.router.navigate(['home']);
      },
      (err) => {
        this.spinnerService.disable();
        console.error('Cannot verify code: ', err);
      }
    );
  }

  resendCode() {
    this.spinnerService.enable();
    this.httpService.post('register/resend', {
      username: this.authService.userDetails.username,
    }).subscribe(
      data => {
        this.spinnerService.disable();
      },
      // console.log('New code is sent: ', data);
      err => {
        this.spinnerService.disable();
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

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['home']);
      })
      .catch();
  }
}
