import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {HttpService} from '../../../shared/services/http.service';
import {UpsertAddressComponent} from '../../../shared/components/upsert-address/upsert-address.component';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {

  withDelivery = true;
  selectedCustomerAddresses = -1;
  selectedWareHouseAddresses = -1;

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
  customerAddresses = [];
  wareHouseAddresses = [];
  curHeight: number;
  curWidth: number;


  setAddress(i: number) {
    if (this.withDelivery) {
      if (i === this.selectedCustomerAddresses)
        this.selectedCustomerAddresses = -1;
      else
        this.selectedCustomerAddresses = i;
    }
    else {
      if (i === this.selectedWareHouseAddresses)
        this.selectedWareHouseAddresses = -1;
      else
        this.selectedWareHouseAddresses = i;
    }
  }

  getCustomerAddresses() {
    this.httpService.get(`customer/address`).subscribe(res => {
      if (this.withDelivery) {
        if (this.addresses.length === res.addresses.length - 1)
          this.selectedCustomerAddresses = res.addresses.length - 1;
        else if (res.addresses.length === 1)
          this.selectedCustomerAddresses = 0;
        this.addresses = res.addresses;
      }
      this.customerAddresses = res.addresses;
    }, err => {
      console.error(err);
    });

  }

  getWareHouseAddresses() {
    // make request
    this.wareHouseAddresses = [
      {
        'province': 'تهران',
        'city': 'تهران',
        'street': ' کوچه شهریور ',
        'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
        'no': '۵',
        'unit': '۱',
      },
      {
        'province': 'تهران',
        'city': 'تهران',
        'street': ' کوچه شهریور ',
        'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
        'no': '۵',
        'unit': '۱',
      },
      {
        'province': 'تهران',
        'city': 'تهران',
        'street': ' کوچه شهریور ',
        'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
        'no': '۵',
        'unit': '۱',
      }];
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }

  constructor(private dialog: MatDialog, private authService: AuthService, private httpService: HttpService) { }

  address = {
    ostan: 'البرز',
    city: 'کرج',
    street: 'دربند',
    no: 14,
    unit: 1,
    postal_code: 1044940912,
    loc: {
      long: 50.817191,
      lat: 51.427251,
    },
    recipient_name: 'علی علوی',
    recipient_mobile_no: '09121212121',
    recipient_national_id: '06423442',
    recipient_title: 'm',
    district: 'خیابان سوم'
  };
  ngOnInit() {
    this.getCustomerAddresses();
    this.getWareHouseAddresses();
  }


  editAddress(id) {
    // const tempAddressId = (id || id === 0) ? this.addresses[id].addressId : null;
    const tempAddressId = (id || id === 0) ? id + 1 : null;
    const tempAddress = (id || id === 0) ? this.addresses[id] : null;
    const partEdit = !!(id || id === 0);
z    const rmDialog = this.dialog.open(UpsertAddressComponent, {
      width: '600px',
      data: {
        addressId: tempAddressId,
        partEdit: partEdit,
        fullEdit: fullEdit,
        dialog_address: tempAddress,
      }
    });
    rmDialog.afterClosed().subscribe(result => {
      this.getCustomerAddresses();
    });
  }

  changeWithDelivery() {
    this.withDelivery = !this.withDelivery;
    if (this.withDelivery)
      this.addresses = this.customerAddresses;
    else
      this.addresses = this.wareHouseAddresses;
          (data) => {
        if (data) {
          console.log('*****', data);
          this.httpService.post('user/address', {
            username: this.authService.userDetails.username,
            body: data,
          }).subscribe(
            (data) => {
              console.log('sucsess');
            },
            (err) => {
              console.error('Cannot set address');
            }
          );
        }
      },
      (err) => {
        console.error('Error in dialog: ', err);
      }
    );
  }
}
