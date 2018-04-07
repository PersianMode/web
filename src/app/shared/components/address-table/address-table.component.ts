import {Component, Inject, Input, OnInit} from '@angular/core';
import {WINDOW} from '../../services/window.service';
import {HttpService} from '../../services/http.service';
import {MatDialog} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {ResponsiveService} from '../../services/responsive.service';
import {Router} from '@angular/router';
import {GenDialogComponent} from '../gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../enum/dialog.components.enum';
import {CheckoutService} from '../../services/checkout.service';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {
  @Input() isProfile = true;
  lat: number;
  long: number;
  withDelivery = true;
  selectedCustomerAddresses = -1;
  selectedWareHouseAddresses = -1;

  addresses = [];
  customerAddresses = [];
  wareHouseAddresses = [];
  isMobile = false;

  constructor(@Inject(WINDOW) private window, private httpService: HttpService,
              private dialog: MatDialog, private checkoutService: CheckoutService,
              private responsiveService: ResponsiveService, private router: Router,
              private authService: AuthService) {
    this.isMobile = this.responsiveService.isMobile;
  }

  getLatitude() {
    return this.addresses[this.selectedWareHouseAddresses].loc.type.lat;
  }

  getLongitude() {
    return this.addresses[this.selectedWareHouseAddresses].loc.type.long;
  }

  setAddress(i: number) {
    if (this.withDelivery) {
      if (i === this.selectedCustomerAddresses)
        this.selectedCustomerAddresses = -1;
      else
        this.selectedCustomerAddresses = i;
    } else {
      if (i === this.selectedWareHouseAddresses)
        this.selectedWareHouseAddresses = -1;
      else {
        this.selectedWareHouseAddresses = i;
        this.lat = 1;
        this.long = 1;
      }
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
    // TODO: this should be changed from hard-coded to a request from server
    this.httpService.get('warehouse').subscribe(res => {
      this.wareHouseAddresses = res;
    });
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }

  ngOnInit() {
    this.getCustomerAddresses();
    this.getWareHouseAddresses();
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    console.log('isProfile', this.isProfile);
  }

  openAddressDialog(id?) {
    const tempAddress = id ? this.addresses.find(el => el._id === id) : {};
    const partEdit = id ? true : false;
    this.checkoutService.addressData = {
      addressId: (id || id === 0) ? id + 1 : null,
      partEdit: partEdit,
      dialog_address: tempAddress
    };
    const rmDialog = this.dialog.open(GenDialogComponent, {
      width: '600px',
      data: {
        componentName: DialogEnum.upsertAddress,
      }
    });
    rmDialog.afterClosed().subscribe(
      () => this.getCustomerAddresses(),
      (err) => {
        console.error('Error in dialog: ', err);
      }
    );
  }

  editAddress(id) {
    const tempAddressId: string = (id || id === 0) ? id + 1 : null;
    const tempAddress = (id || id === 0) ? this.addresses[id] : null;
    const partEdit = !!(id || id === 0);
    this.checkoutService.addressData = {
      addressId: tempAddressId,
      partEdit: this.isProfile ? false : partEdit,
      dialog_address: tempAddress
    };
    console.log('partEdit', this.checkoutService.addressData.partEdit);
    if (this.responsiveService.isMobile) {
      this.router.navigate([`/checkout/address`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '600px',
        data: {
          componentName: DialogEnum.upsertAddress
        },
      });
    }
  }

  changeWithDelivery() {
    if (this.withDelivery)
      this.addresses = this.customerAddresses;
    else
      this.addresses = this.wareHouseAddresses.map(r => Object.assign({name: r.name}, r.address));
  }
}
