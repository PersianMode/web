import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {

  selectedAddress = -1;
  addresses = [{
    'country': 'تهران',
    'city': 'تهران',
    'street': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت کوچه شهریور ',
    'no': '۵',
    'unit': '۱',
    'socialNumber': '0021625018',
    'takerName': 'علی میرجهانی',
    'phoneNumber': '021625018'
  }, {
    'country': 'تهران',
    'city': 'تهران',
    'street': 'میدان فاطمی خیابان هشت بهشت',
    'no': '۵',
    'unit': '۱',
    'socialNumber': '0021625018',
    'takerName': 'علی میرجهانی',
    'phoneNumber': '021625018'
  }];
  curHeight: number;
  curWidth: number;

  constructor(@Inject(WINDOW) private window) {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;
  }

  setAddress(i: number) {
    if (i === this.selectedAddress)
      this.selectedAddress = -1;
    else
      this.selectedAddress = i;
  }


  ngOnInit() {
    // make request and
  }

}
