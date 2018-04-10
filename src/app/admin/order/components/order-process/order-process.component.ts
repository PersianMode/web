import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {AuthService} from '../../../../shared/services/auth.service';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {HttpService} from '../../../../shared/services/http.service';
import {REFERRAL_ADVICE} from '../../../../shared/enum/referral_advise.enum';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit {
  isSalesManager = false;

  instance: any;
  inventories: any[];
  selectedWarehouseId: string;
  referralAdvise: number;
  desc: string;

  invoceButtonActive: false;

  ReferralAdvises: any[] = [
    {name: 'ارسال به مرکزی', value: REFERRAL_ADVICE.SendToCentral},
    {name: 'ارسال به مشتری', value: REFERRAL_ADVICE.SendToCustomer},
  ];

  constructor(private dialogRef: MatDialogRef<OrderProcessComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private authService: AuthService,
              private httpService: HttpService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {

    this.isSalesManager = this.authService.userDetails.accessLevel === AccessLevel.SalesManager;
    this.reload();
  }

  reload() {

    this.httpService.get(`product/instance/${this.data.product_id}/${this.data.instance._id}`).subscribe(res => {
      this.instance = res;
      this.getWarehouseInfo();

    }, err => {
      this.openSnackBar('cannot get product info');
    });

  }

  getWarehouseInfo() {

    this.inventories = [];
    this.authService.warehouses.forEach(warehouse => {
      const foundInventory = this.instance.inventory.find(x => x.warehouse_id === warehouse._id);
      if (foundInventory.count > 0) {
        this.inventories.push({
          warehouse,
          count: foundInventory.count
        });
      }
    });


    if (this.data.is_collect) {

      const foundInventory = this.inventories.find(x => x.warehouse.address._id === this.data.address_id);
      if (foundInventory) {
        this.selectedWarehouseId = foundInventory.warehouse._id;
      } else {
        this.openSnackBar('C&C warehouse has 0 count of this product instance');
      }
    }
  }


  onInventoryChange(warehouseId) {
    this.selectedWarehouseId = warehouseId;
    this.invoceButtonActive = this.authService.warehouses.find(x => this.selectedWarehouseId === x._id).is_center;
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
