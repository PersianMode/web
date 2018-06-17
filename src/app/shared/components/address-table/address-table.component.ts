import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {WINDOW} from '../../services/window.service';
import {HttpService} from '../../services/http.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {ResponsiveService} from '../../services/responsive.service';
import {Router} from '@angular/router';
import {GenDialogComponent} from '../gen-dialog/gen-dialog.component';
import {DialogEnum} from '../../enum/dialog.components.enum';
import {CheckoutService} from '../../services/checkout.service';
import {userInfo} from 'os';
import {ProgressService} from '../../services/progress.service';


@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.css']
})
export class AddressTableComponent implements OnInit {
  addressSelected;
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
  deliveryHour: { enum: ['10-18', '18-22'] };
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
    this.noDuration.emit(null);
    this.responsiveService.switch$.subscribe(isMobile => this.isMobile = isMobile);
    this.authService.isLoggedIn.subscribe(r => {
      this.isLoggedIn = this.authService.userIsLoggedIn();
    });
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
        if (this.addresses.length === res.length - 1)
          this.selectedCustomerAddress = res.length - 1;
        else if (res.length === 1)
          this.selectedCustomerAddress = 0;
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
        this.selectedCustomerAddress >= 0 ? this.addresses[this.selectedCustomerAddress] : null
        : this.selectedWarehouseAddress >= 0 ? this.addresses[this.selectedWarehouseAddress] : null,
    ];
  }

  private setBtnLabel() {
    this.addrBtnLabel = this.withDelivery ? 'افزودن آدرس جدید' : 'معرفی تحویل‌گیرنده';
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
    } else {
      if (i === this.selectedWarehouseAddress) {
        this.selectedWarehouseAddress = -1;
      } else {
        this.selectedWarehouseAddress = i;
        this.loc = this.locs[this.addresses[this.selectedWarehouseAddress].name];
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
      dialog_address: this.withDelivery ? {} : customerAddresses ? customerAddresses[0] : {},
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
        () => {
          if (this.withDelivery) {
            this.checkoutService.getCustomerAddresses();
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
    const tempAddress = (id || id === 0) ? this.addresses[id] : null;
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

  changeWithDelivery() {
    this.deliveryType.emit(this.withDelivery);
    if (this.withDelivery) {
      this.addresses = this.checkoutService.addresses$.getValue();
      this.showAddresses = this.addresses;
      if (this.addresses && this.addresses.length && this.deliveryDays && (this.deliveryDays === 2 || this.deliveryDays === 3)) {
        this.tehranAddresses = this.addresses.filter(el => el.province === 'تهران');
        this.showAddresses = this.tehranAddresses;
      } else
        this.showAddresses = this.addresses;
      // this.progressService.enable();
      // this.httpService.post('loyaltygroup/', {
      //   _id: this.authService.userDetails.userId,
      //   deliveryPeriodDay: this.deliveryPeriodDay,
      // }).subscribe(
      //   res => {
      //     this.snackBar.open('تغییرات با موفقیت ثبت شدند', null, {
      //       duration: 2000,
      //     });
      //
      //     this.progressService.disable();
      //   },
      //   err => {
      //     console.error('Cannot send delivery information: ', err);
      //     this.snackBar.open('سیستم قادر به اعمال تغییرات شما نیست. دوباره تلاش کنید', null, {
      //       duration: 2000,
      //     });
      //     this.progressService.disable();
      //   });

    } else {
      this.addresses = this.checkoutService.warehouseAddresses.map(r => Object.assign({name: r.name}, r.address));
      this.showAddresses = this.addresses;
    }
    this.setState();
    this.setBtnLabel();

  }

  changeDurationType(durationId, deliveryDays) {
    this.durationId = durationId;
    this.deliveryDays = deliveryDays;
    this.noDuration.emit(true);
    this.durationType.emit(durationId);
    if (this.addresses && this.addresses.length && (deliveryDays === 2 || deliveryDays === 3) {
      this.tehranAddresses = this.addresses.filter(el => el.province === 'تهران');
      this.showAddresses = this.tehranAddresses;
    } else
      this.showAddresses = this.addresses;
  }

  chooseAddress($event) {
    console.log($event);
    this.selectedChange.emit(this.addressSelected);
  }
}
