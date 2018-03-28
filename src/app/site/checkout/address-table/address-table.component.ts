import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {HttpService} from '../../../shared/services/http.service';
import {priceFormatter} from '../../../shared/lib/priceFormatter';


@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {

  selectedAddress = -1;
  // addresses = [
  //   {
  //   'province': 'تهران',
  //   'city': 'تهران',
  //   'street': ' کوچه شهریور ',
  //   'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
  //   'no': '۵',
  //   'unit': '۱',
  //   'recipient_national_id': '0021625018',
  //   'recipient_name': 'علی میرجهانی',
  //   'recipient_mobile_no': '09391022382'
  // },
  //   {
  //   'province': 'تهران',
  //   'city': 'تهران',
  //   'street': ' کوچه شهریور ',
  //   'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
  //   'no': '۵',
  //   'unit': '۱',
  //   'recipient_national_id': '0021625018',
  //   'recipient_name': 'علی میرجهانی',
  //   'recipient_mobile_no': '09391022382'
  // },
  //   {
  //   'province': 'تهران',
  //   'city': 'تهران',
  //   'street': ' کوچه شهریور ',
  //   'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
  //   'no': '۵',
  //   'unit': '۱',
  //   'recipient_national_id': '0021625018',
  //   'recipient_name': 'علی میرجهانی',
  //   'recipient_mobile_no': '09391022382'
  // }];
  addresses = [];
  curHeight: number;
  curWidth: number;
  private addr: null;

  constructor(@Inject(WINDOW) private window, private httpService: HttpService) {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;
  }

  setAddress(i: number) {
    if (i === this.selectedAddress)
      this.selectedAddress = -1;
    else
      this.selectedAddress = i;
  }

  getAddresses() {
    this.httpService.get(`customer/address`).subscribe(res => {
      if (this.addresses.length === res.addresses.length - 1)
        this.selectedAddress = res.addresses.length - 1;
      else if (res.addresses.length === 1)
        this.selectedAddress = 0;
      this.addresses = res.addresses;
      console.log(res);
    }, err => {
      console.error(err);
    });

  }

  makePersianPrice(a: string) {
    console.log(a);
    return console.log(priceFormatter(a));

  }

  ngOnInit() {
    this.getAddresses();
  }

  makeNewAddress() {
    console.log('making new address');
  }
}
