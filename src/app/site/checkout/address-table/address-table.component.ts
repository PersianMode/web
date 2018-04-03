import { Component, OnInit } from '@angular/core';
import {UpsertAddressComponent} from '../../../shared/components/upsert-address/upsert-address.component';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/services/auth.service';
import {HttpService} from '../../../shared/services/http.service';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {
  // address = {
  //   province: 'البرز',
  //   city: 'کرج',
  //   street: 'دربند',
  //   no: 14,
  //   unit: 1,
  //   postal_code: 1044940912,
  //   loc: {
  //     long: 50.817191,
  //     lat: 51.427251,
  //   },
  //   recipient_name: 'علی',
  //   recipient_surname: 'علوی',
  //   recipient_mobile_no: '09121212121',
  //   recipient_national_id: '06423442',
  //   recipient_title: 'm',
  //   district: 'خیابان سوم'
  // };
  addresses = [];
  tempAddressId;
  constructor(private dialog: MatDialog, private authService: AuthService, private httpService: HttpService) { }

  ngOnInit() {
    this.getCustomerAddresses();
  }

  openAddressDialog(id?) {
    const tempAddress = id ? this.addresses.find(el => el._id === id) : {};
    console.log(tempAddress);
    const partEdit = id ? true : false;
    const rmDialog = this.dialog.open(UpsertAddressComponent, {
      width: '600px',
      data: {
        addressId: this.tempAddressId,
        partEdit: partEdit,
        dialog_address: tempAddress,
      }
    });
    rmDialog.afterClosed().subscribe(
      (data) => {
        if (data) {
          this.httpService.post('user/address', data).subscribe(
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

  getCustomerAddresses() {
    this.httpService.get('customer/address').subscribe(res => {
      this.addresses = res.addresses;
      this.tempAddressId = res.addresses.length ? this.addresses[1]._id : null;
    }, err => {
      console.error(err);
    });
  }
}
