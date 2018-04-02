import {Injectable} from '@angular/core';
import {IAddressInfo} from '../interfaces/iaddressInfo.interface';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';

@Injectable()
export class CheckoutService {

  addressData: IAddressInfo;

  constructor(private httpService: HttpService,
              private authService: AuthService) {
  }

  submitAddresses(data) {
    if (data) {
      console.log('****', data);
      this.httpService.post('user/address', {
        username: this.authService.userDetails.username,
        body: data,
      }).subscribe(
        (res) => {
          console.log('success');
        },
        (err) => {
          console.log('couldn\'t set address');
        }
      );
    }
  }
}
