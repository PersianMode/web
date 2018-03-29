import {Injectable} from '@angular/core';
import {IaddressInfo} from '../interfaces/iaddressInfo.interface';

@Injectable()
export class CheckoutService {

  addressData: IaddressInfo;
}
