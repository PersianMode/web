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
  constructor(private dialog: MatDialog, private authService: AuthService, private httpService: HttpService) { }

  ngOnInit() {
  }

  openAddressDialog(id) {
    const tempAddressId = id ? id : null;
    const tempAddress = id ? this.address : {};
    const partEdit = id ? true : false;
    const fullEdit = id ? false : true;
    const rmDialog = this.dialog.open(UpsertAddressComponent, {
      width: '600px',
      data: {
        addressId: tempAddressId,
        partEdit: partEdit,
        fullEdit: fullEdit,
        dialog_address: tempAddress,
      }
    });
    rmDialog.afterClosed().subscribe(
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
