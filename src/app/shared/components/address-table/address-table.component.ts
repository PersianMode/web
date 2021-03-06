import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {WINDOW} from '../../services/window.service';
import {HttpService} from '../../services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {ResponsiveService} from '../../services/responsive.service';
import {Router} from '@angular/router';
import {GenDialogComponent} from '../gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../enum/dialog.components.enum';
import {TIME_SLOT} from '../../enum/delivery.enum';
import {CheckoutService} from '../../services/checkout.service';
import {ProgressService} from '../../services/progress.service';
import {RemovingConfirmComponent} from '../removing-confirm/removing-confirm.component';
import {PlacementModifyEnum} from '../../../admin/page/enum/placement.modify.type.enum';


@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {
  addressSelected;
  time_slot = TIME_SLOT;
  @Input() isProfile = true;
  @Input() isModify = true;
  @Output() selectedChange = new EventEmitter();
  @Output() deliveryType = new EventEmitter();
  @Output() durationType = new EventEmitter();
  @Output() noDuration = new EventEmitter();

  locs = {
    'ایران مال': [35.7545945, 51.1921283],
    'سانا': [35.8024766, 51.4552242],
    'پالادیوم': [35.7975691, 51.4107673],
  };

  deliveryHour = [];
  loc = null;

  addresses = [];
  isMobile = false;
  isLoggedIn = false;
  durations: any = [];
  durationId;
  province;
  showRecipientInfo = false;

  withDelivery;
  selectedCustomerAddress = -1;
  selectedWarehouseAddress = -1;
  deliveryDays;
  deliveryTime;

  constructor(@Inject(WINDOW) private window, private httpService: HttpService,
              private dialog: MatDialog, private checkoutService: CheckoutService,
              private responsiveService: ResponsiveService, private router: Router,
              private authService: AuthService, private progressService: ProgressService, private snackBar: MatSnackBar) {
    this.isMobile = this.responsiveService.isMobile;
  }

  async ngOnInit() {
    this.durations = await this.checkoutService.getDurations();
    this.withDelivery = this.checkoutService.withDelivery;
    this.changeWithDelivery();
    this.selectedCustomerAddress = this.checkoutService.selectedCustomerAddress;
    this.selectedWarehouseAddress = this.checkoutService.selectedWarehouseAddress;
    this.setAddressDataForService();
    this.deliveryDays = this.checkoutService.deliveryDays;
    this.deliveryTime = this.checkoutService.deliveryTime;

    this.showRecipientInfo = this.checkoutService.ccRecipientData ? this.checkoutService.ccRecipientData : null;
    this.noDuration.emit(null);
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.authService.isLoggedIn.subscribe(r => {
      this.isLoggedIn = this.authService.userIsLoggedIn();
    });

    this.deliveryHour = [];
    Object.keys(this.time_slot).forEach(el => this.deliveryHour.push(this.time_slot[el]));

    this.province = this.checkoutService.addedProvince ? this.checkoutService.addedProvince : null;
    if (this.province) {
      this.checkoutService.getCustomerAddresses();
    }

    this.checkoutService.addresses$.subscribe(res => {
      this.province = this.checkoutService.addedProvince ? this.checkoutService.addedProvince : null;
      this.addresses = res;
      if (!this.isProfile) {
        if (this.withDelivery) {
          if (this.deliveryDays === 3) {// should change days if added address is not tehran
            if (this.province) {
              if (this.province !== 'تهران') {
                const duration_5 = this.durations.filter(el => el.delivery_days === 5)[0];
                this.changeDurationType(duration_5._id, duration_5.delivery_days);
                this.selectedCustomerAddress = this.addresses.length - 1;
                this.province = '';
              } else {
                if (this.addresses && this.addresses.length && this.deliveryDays && (this.deliveryDays === 3)) {
                  this.filterTehranAddresses();
                }
                this.selectedCustomerAddress = this.addresses.length - 1;
                this.province = '';
              }
            } else if (!this.province)
              this.filterTehranAddresses();
          } else if (res && res.length) {
            if (this.addresses.length === res.length - 1) {
              this.selectedCustomerAddress = res.length - 1;
            } else if (res.length === 1) {
              this.selectedCustomerAddress = 0;
            }
          }
          this.checkoutService.selectedCustomerAddress = this.selectedCustomerAddress;
        } else {
          this.addresses = this.checkoutService.warehouseAddresses.map(r => Object.assign({name: r.name}, r.address));
        }
      }

      this.setAddressDataForService();
    });

  }

  changeWithDelivery() {
    this.checkoutService.withDelivery = this.withDelivery;
    this.deliveryType.emit(this.withDelivery);
    if (this.withDelivery) {
      this.addresses = this.checkoutService.addresses$.getValue();

      if (this.addresses && this.addresses.length && this.deliveryDays && (this.deliveryDays === 3)) {
        this.filterTehranAddresses();
      }
    } else {
      this.addresses = this.checkoutService.warehouseAddresses.map(r => Object.assign({name: r.name}, r.address));
    }
    this.setAddressDataForService();
  }

  setAddressDataForService() {
    this.checkoutService.addressObj =
      this.withDelivery ?
        this.selectedCustomerAddress >= 0 ? this.addresses[this.selectedCustomerAddress] : null
        : this.selectedWarehouseAddress >= 0 ? this.addresses[this.selectedWarehouseAddress] : null;
    this.checkoutService.checkValidity();
  }

  getLatitude() {
    return this.addresses[this.selectedWarehouseAddress].loc ? this.addresses[this.selectedWarehouseAddress].loc.lat :
      this.loc ? this.loc[0] : 35.7322793;
  }

  getLongitude() {
    return this.addresses[this.selectedWarehouseAddress].loc ? this.addresses[this.selectedWarehouseAddress].loc.long :
      this.loc ? this.loc[1] : 51.2140536;
  }

  setAddress(i: number) {
    if (this.withDelivery) {
      if (i === this.selectedCustomerAddress) {
        this.selectedCustomerAddress = -1;
      } else {
        this.selectedCustomerAddress = i;
      }
      this.checkoutService.selectedCustomerAddress = this.selectedCustomerAddress;
    } else {
      if (i === this.selectedWarehouseAddress) {
        this.selectedWarehouseAddress = -1;
      } else {
        this.selectedWarehouseAddress = i;
        this.loc = this.locs[this.addresses[this.selectedWarehouseAddress].name];
      }
      this.checkoutService.selectedWarehouseAddress = this.selectedWarehouseAddress;
    }
    this.setAddressDataForService();
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }

  openAddressDialog() {
    this.checkoutService.addressData = {
      addressId: this.withDelivery ? null : '1',
      partEdit: !this.isProfile && !this.withDelivery,
      withDelivery: this.withDelivery,
      // dialog_address: this.withDelivery ? {} : this.showRecipientInfo ? this.showRecipientInfo : {},
      dialog_address: {},
    };
    if (this.responsiveService.isMobile) {
      this.router.navigate([`/checkout/address`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '600px',
        data: {
          componentName: DialogEnum.upsertAddress,
        }
      });
      rmDialog.afterClosed().subscribe(
        (data) => {
          this.province = this.checkoutService.addedProvince;
          if (!this.withDelivery) {
            this.showRecipientInfo = this.checkoutService.ccRecipientData;
          } else if (this.province) {
            this.checkoutService.getCustomerAddresses();
          }

          this.checkoutService.checkValidity();
        },
        (err) => {
          console.error('Error in dialog: ', err);
          this.checkoutService.checkValidity();
        }
      );
    }
  }

  removeRecipient() {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();

          this.checkoutService.ccRecipientData = null;
          this.showRecipientInfo = null;
          this.checkoutService.checkValidity();
        }
      }, err => {
        console.log('Error in dialog: ', err);
        this.checkoutService.checkValidity();
      });
  }

  editAddress(id) {
    const tempAddressId: string = (id || id === 0) ? id + 1 : null;
    const tempAddress = (id || id === 0) ? this.addresses[id] : null;
    this.checkoutService.addressData = {
      addressId: tempAddressId,
      partEdit: !this.authService.userIsLoggedIn() ? !this.withDelivery : !this.isProfile,
      withDelivery: this.isProfile ? null : this.withDelivery,
      dialog_address: this.withDelivery || this.isProfile ? tempAddress : this.showRecipientInfo,
    };
    if (this.responsiveService.isMobile) {
      this.router.navigate([`/checkout/address`]);
    } else {
      const rmDialog = this.dialog.open(GenDialogComponent, {
        width: '600px',
        data: {
          componentName: DialogEnum.upsertAddress
        },
      });

      rmDialog.afterClosed().subscribe(
        () => {
          if (!this.withDelivery) {
            this.showRecipientInfo = this.checkoutService.ccRecipientData;
          } else {
            this.checkoutService.getCustomerAddresses();
          }
          this.checkoutService.checkValidity();
        },
        (err) => {
          console.error('Error in dialog: ', err);
          this.checkoutService.checkValidity();
        });
    }
  }

  setDeliveryTime(deliveryTime) {
    this.deliveryTime = deliveryTime;
    this.checkoutService.deliveryTime = this.deliveryTime;
    this.checkoutService.checkValidity();
  }

  changeDurationType(durationId, deliveryDays) {
    this.addresses = this.checkoutService.addresses$.getValue();
    this.durationId = durationId;
    this.checkoutService.deliveryDurationId = durationId;
    this.deliveryDays = deliveryDays;
    this.noDuration.emit(true);
    this.durationType.emit(durationId);
    if (this.addresses && this.addresses.length && deliveryDays === 3) {
      this.filterTehranAddresses();
    }
    this.selectedCustomerAddress = this.addresses && this.addresses.length ? 0 : -1;
    this.checkoutService.selectedCustomerAddress = this.selectedCustomerAddress;
    this.checkoutService.deliveryDays = this.deliveryDays;
    this.setAddressDataForService();
  }

  filterTehranAddresses() {
    this.addresses = this.addresses.filter(el => el.province === 'تهران');
    if (!this.addresses || this.addresses.length === 0)
      this.selectedCustomerAddress = -1;

    this.checkoutService.selectedCustomerAddress = this.selectedCustomerAddress;
    this.checkoutService.checkValidity();
  }

  chooseAddress($event) {
    this.selectedChange.emit(this.addressSelected);
  }

  getDeliveryTimeDisplay(time_slot) {
    return 'ساعت ' + (time_slot.lower_bound).toLocaleString('fa') + ' - ' + (time_slot.upper_bound).toLocaleString('fa');
  }
}

