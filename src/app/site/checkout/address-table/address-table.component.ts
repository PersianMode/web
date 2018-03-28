import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '../../../shared/services/window.service';
import {HttpService} from '../../../shared/services/http.service';
import {UpsertAddressComponent} from '../../../shared/components/upsert-address/upsert-address.component';
import {MatDialog} from '@angular/material';
import {ResponsiveService} from '../../../shared/services/responsive.service';
import {Router} from '@angular/router';
import {GenDialogComponent} from "../../../shared/components/gen-dialog/gen-dialog.component";
import {DialogEnum} from "../../../shared/enum/dialog.components.enum";


@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {

  withDelivery = true;
  selectedCustomerAddresses = -1;
  selectedWareHouseAddresses = -1;

  addresses = [
    {
      'province': 'تهران',
      'city': 'تهران',
      'street': ' کوچه شهریور ',
      'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
      'no': '۵',
      'unit': '۱',
      'recipient_national_id': '0021625018',
      'recipient_name': 'علی میرجهانی',
      'recipient_mobile_no': '09391022382'
    },
    {
      'province': 'تهران',
      'city': 'تهران',
      'street': ' کوچه شهریور ',
      'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
      'no': '۵',
      'unit': '۱',
      'recipient_national_id': '0021625018',
      'recipient_name': 'علی میرجهانی',
      'recipient_mobile_no': '09391022382'
    },
    {
      'province': 'تهران',
      'city': 'تهران',
      'street': ' کوچه شهریور ',
      'district': 'میدان فاطمی خیابان فاطمی خیابان هشت بهشت',
      'no': '۵',
      'unit': '۱',
      'recipient_national_id': '0021625018',
      'recipient_name': 'علی میرجهانی',
      'recipient_mobile_no': '09391022382'
    }];
  // addresses = [];
  customerAddresses = [];
  wareHouseAddresses = [];
  curHeight: number;
  curWidth: number;

  constructor(@Inject(WINDOW) private window, private httpService: HttpService, private dialog: MatDialog,
              private responsiveService: ResponsiveService, private router: Router) {
    this.curWidth = this.window.innerWidth;
    this.curHeight = this.window.innerHeight;
  }

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

  ngOnInit() {
    this.getCustomerAddresses();
    this.getWareHouseAddresses();
  }


  editAddress(id) {
    // const tempAddressId = (id || id === 0) ? this.addresses[id].addressId : null;
    console.log('mobileness: ', this.responsiveService.isMobile);
    const tempAddressId = (id || id === 0) ? id + 1 : null;
    const tempAddress = (id || id === 0) ? this.addresses[id] : null;
    const partEdit = !!(id || id === 0);
    const fullEdit = (!(id || id === 0));

    if (this.responsiveService.isMobile) {
      this.router.navigate([`/checkout/address`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '600px',
        data: {
          componentName: DialogEnum.upsertAddress,
          extraData: {
            addressId: tempAddressId,
            partEdit: partEdit,
            fullEdit: fullEdit,
            dialog_address: tempAddress,
          }
        },
      });
      rmDialog.afterClosed().subscribe(result => {
        this.getCustomerAddresses();
      });
    }
  }

  changeWithDelivery() {
    this.withDelivery = !this.withDelivery;
    if (this.withDelivery)
      this.addresses = this.customerAddresses;
    else
      this.addresses = this.wareHouseAddresses;
  }
}
