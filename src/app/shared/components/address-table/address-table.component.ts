import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {WINDOW} from '../../services/window.service';
import {HttpService} from '../../services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {ResponsiveService} from '../../services/responsive.service';
import {Router} from '@angular/router';
import {GenDialogComponent} from '../gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../enum/dialog.components.enum';
import {time_slotEnum} from '../../enum/time_slot.enum';
import {CheckoutService} from '../../services/checkout.service';
import {ProgressService} from '../../services/progress.service';


@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {
  addressSelected;
  time_slot = time_slotEnum;
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
  deliveryPeriodDay = [];
  delivery_time = null;
  deliveryHour = [];
  loc = null;
  withDelivery = true;
  selectedCustomerAddress = -1;
  selectedWarehouseAddress = -1;
  addrBtnLabel = 'افزودن آدرس جدید';
  addresses = [];
  tehranAddresses = [];
  showAddresses = [];
  isMobile = false;
  isLoggedIn = false;
  durations = [];
  durationId;
  deliveryDays;


  constructor(@Inject(WINDOW) private window, private httpService: HttpService,
              private dialog: MatDialog, private checkoutService: CheckoutService,
              private responsiveService: ResponsiveService, private router: Router,
              private authService: AuthService, private progressService: ProgressService, private snackBar: MatSnackBar) {
    this.isMobile = this.responsiveService.isMobile;
  }

  ngOnInit() {
    this.delivery_time = null;
    this.noDuration.emit(null);
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.authService.isLoggedIn.subscribe(r => {
      this.isLoggedIn = this.authService.userIsLoggedIn();
    });

    this.deliveryHour = [];
    Object.keys(this.time_slot).forEach(el => this.deliveryHour.push(this.time_slot[el]));

    const state = this.checkoutService.addressState;
    if (state) {
      [this.withDelivery, this.selectedCustomerAddress, this.selectedWarehouseAddress]
        = this.checkoutService.addressState;
      if (this.isProfile)
        this.withDelivery = true;
      this.changeWithDelivery();
    }
    this.checkoutService.addresses$.subscribe(res => {
      if (res && res.length && this.withDelivery) {
        if (this.showAddresses.length === res.length - 1) {
          this.selectedCustomerAddress = res.length - 1;
        } else if (res.length === 1) {
          this.selectedCustomerAddress = 0;
        }
        this.addresses = res;
        this.showAddresses = this.addresses;
        this.setState();
      }
    });

    this.setState();

    this.getDurations();
  }

  private setState() {
    this.checkoutService.addressState = [
      this.withDelivery,
      this.selectedCustomerAddress,
      this.selectedWarehouseAddress,
      JSON.parse(localStorage.getItem('address')),
      this.withDelivery ?
        this.selectedCustomerAddress >= 0 ? this.showAddresses[this.selectedCustomerAddress] : null
        : this.selectedWarehouseAddress >= 0 ? this.showAddresses[this.selectedWarehouseAddress] : null,

      this.withDelivery ? this.deliveryDays : null,
      this.withDelivery ? this.delivery_time : null
    ];
  }

  private setBtnLabel() {
    this.addrBtnLabel = this.withDelivery ? 'افزودن آدرس جدید' : 'معرفی تحویل‌گیرنده';
  }

  getLatitude() {
    return this.showAddresses[this.selectedWarehouseAddress].loc ? this.showAddresses[this.selectedWarehouseAddress].loc.lat :
      this.loc ? this.loc[0] : 35.7322793;
  }

  getLongitude() {
    return this.showAddresses[this.selectedWarehouseAddress].loc ? this.showAddresses[this.selectedWarehouseAddress].loc.long :
      this.loc ? this.loc[1] : 51.2140536;
  }

  setAddress(i: number) {
    if (this.withDelivery) {
      if (i === this.selectedCustomerAddress) {
        this.selectedCustomerAddress = -1;
      } else {
        this.selectedCustomerAddress = i;
      }
    } else {
      if (i === this.selectedWarehouseAddress) {
        this.selectedWarehouseAddress = -1;
      } else {
        this.selectedWarehouseAddress = i;
        this.loc = this.locs[this.showAddresses[this.selectedWarehouseAddress].name];
      }
    }
    this.setState();
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }

  openAddressDialog() {
    const customerAddresses = this.checkoutService.addresses$.getValue();
    this.checkoutService.addressData = {
      addressId: this.withDelivery ? null : '1',
      partEdit: !this.withDelivery,
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
          if (this.withDelivery) {
            if (this.deliveryDays === 3) { // should change days if added address is not tehran
              if (data !== 'تهران') {
                const duration_5 = this.durations.filter(el => el.delivery_days === 5)[0];
                this.changeDurationType(duration_5._id, duration_5.delivery_days);
              } else {
                this.addresses = this.checkoutService.addresses$.getValue();
                this.showAddresses = this.addresses;
                if (this.addresses && this.addresses.length && this.deliveryDays && (this.deliveryDays === 2 || this.deliveryDays === 3)) {
                  this.tehranAddresses = this.addresses.filter(el => el.province === 'تهران');
                  this.showAddresses = this.tehranAddresses;
                } else
                  this.showAddresses = this.addresses;
              }
            }
          }
          this.setState();
        },
        (err) => {
          console.error('Error in dialog: ', err);
        }
      );
    }
  }

  editAddress(id) {
    const tempAddressId: string = (id || id === 0) ? id + 1 : null;
    const tempAddress = (id || id === 0) ? this.showAddresses[id] : null;
    this.checkoutService.addressData = {
      addressId: tempAddressId,
      partEdit: !this.isProfile || !this.authService.userIsLoggedIn(),
      dialog_address: tempAddress
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
        () => this.setState(),
        (err) => {
          console.error('Error in dialog: ', err);
        }
      );
    }
  }

  getDurations() {
    this.httpService.get('deliveryduration').subscribe(
      (data) => {
        this.durations = data;
        this.deliveryPeriodDay = data.map(el => el.delivery_days);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setDeliveryTime(deliveryTime) {
    this.delivery_time = deliveryTime;
    this.setState();

  }

  changeWithDelivery() {
    this.deliveryType.emit(this.withDelivery);
    this.setBtnLabel();
    if (this.withDelivery) {
      this.addresses = this.checkoutService.addresses$.getValue();
      this.showAddresses = this.addresses;
      if (this.addresses && this.addresses.length && this.deliveryDays && (this.deliveryDays === 2 || this.deliveryDays === 3)) {
        this.tehranAddresses = this.addresses.filter(el => el.province === 'تهران');
        this.showAddresses = this.tehranAddresses;
      } else
        this.showAddresses = this.addresses;
    } else {
      this.addresses = this.checkoutService.warehouseAddresses.map(r => Object.assign({name: r.name}, r.address));
      this.showAddresses = this.addresses;
    }
    this.setState();
  }

  changeDurationType(durationId, deliveryDays) {
    this.durationId = durationId;
    this.deliveryDays = deliveryDays;
    this.noDuration.emit(true);
    this.durationType.emit(durationId);
    if (this.addresses && this.addresses.length && (deliveryDays === 2 || deliveryDays === 3)) {
      this.tehranAddresses = this.addresses.filter(el => el.province === 'تهران');
      this.showAddresses = this.tehranAddresses;
    } else
      this.showAddresses = this.addresses;

    this.selectedCustomerAddress = 0;

    this.setState();
  }

  chooseAddress($event) {
    this.selectedChange.emit(this.addressSelected);
  }

  getDeliveryTimeDisplay(time_slot) {
    return 'ساعت ' + (time_slot.lower_bound).toLocaleString('fa') + 'تا ' + (time_slot.upper_bound).toLocaleString('fa');
  }
}

