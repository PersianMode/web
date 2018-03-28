import { Component, OnInit } from '@angular/core';
import {UpsertAddressComponent} from '../../../shared/components/upsert-address/upsert-address.component';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {
  address = {
    province: 'Tehran',
    city: 'Shemiran',
    street: 'Darband',
    no: 14,
    unit: 1,
    postal_code: 1044940912,
    loc: {
      long: 35.817191,
      lat: 51.427251,
    },
    recipient_name: 'علی علوی',
    recipient_mobile_no: '09121212121',
    recipient_national_id: '06423442',
    recipient_title: 'm',
    district: 'خیابان سوم'
  }
  constructor(private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
  }

  openAddressDialog(id) {
    console.log(id);
    const tempAddressId = id ? id : null;
    const tempAddress = id ? this.address : null;
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
  }
}
