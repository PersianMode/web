import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {HttpService} from '../../../shared/services/http.service';
// import {UpsertAddressComponent} from '../../../shared/components/upsert-address/upsert-address.component';
import {MatDialog} from '@angular/material';


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

  constructor(@Inject(WINDOW) private window, private httpService: HttpService, private dialog: MatDialog) {
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
    }, err => {
      console.error(err);
    });

  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }

  ngOnInit() {
    this.getAddresses();
  }


  editAddress(id) {
    const tempAddressId = (id || id === 0) ? id : null;
    const tempAddress = (id || id === 0) ? this.addresses[id] : null;
    const partEdit = !!(id || id === 0);
    const fullEdit = (!(id || id === 0));
    // let rmDialog = this.dialog.open(UpsertAddressComponent, {
    //   width: '600px',
    //   data: {
    //     addressId: tempAddressId,
    //     partEdit: partEdit,
    //     fullEdit: fullEdit,
    //     dialog_address: tempAddress,
    //   }
    // });
    // rmDialog.afterClosed().subscribe(result => {
    //   this.getAddresses();
    // });
  }
}
