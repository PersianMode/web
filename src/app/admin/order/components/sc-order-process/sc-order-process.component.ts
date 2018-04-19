import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {AuthService} from '../../../../shared/services/auth.service';
import {AccessLevel} from '../../../../shared/enum/accessLevel.enum';
import {HttpService} from '../../../../shared/services/http.service';
import {REFERRAL_ADVICE} from '../../../../shared/enum/referral_advise.enum';

@Component({
  selector: 'app-order-process',
  templateUrl: './sc-order-process.component.html',
  styleUrls: ['./sc-order-process.component.css']
})
export class SCOrderProcessComponent implements OnInit {
  isSalesManager = false;

  instance: any;
  inventories: any[];
  selectedWarehouse: any;
  referralAdvise: number;
  desc: string;

  showInvoiceButton: false;

  invoiceButtonActive = false;
  referButtonActive = false;

  ReferralAdvises: any[] = [
    {name: 'ارسال به مرکزی', value: REFERRAL_ADVICE.SendToCentral},
    {name: 'ارسال به مشتری', value: REFERRAL_ADVICE.SendToCustomer},
  ];

  constructor(private dialogRef: MatDialogRef<SCOrderProcessComponent>,
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
          count: foundInventory.count,
          reserved: foundInventory.reserved
        });
      }
    });


    if (this.data.is_collect) {

      const foundInventory = this.inventories.find(x => x.warehouse.address._id === this.data.address_id);
      if (foundInventory) {
        this.selectedWarehouse = foundInventory.warehouse;
      } else {
        this.openSnackBar('C&C warehouse has 0 count of this product instance');
      }
      this.referButtonActive = this.invoiceButtonActive = !!foundInventory;
    } else {
      this.referralAdvise = REFERRAL_ADVICE.SendToCentral;
      this.referButtonActive = this.invoiceButtonActive = true;
    }
  }


  onInventoryChange(warehouse) {
    this.selectedWarehouse = warehouse;
    this.showInvoiceButton = this.inventories.find(x => this.selectedWarehouse._id === x.warehouse._id && x.warehouse.is_center);
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  invoice() {

  }

  refer() {

    const body: any = {
      orderId: this.data._id,
      orderLineId: this.data.order_line_id,
    };
    if (this.data.is_collect) {
      body['referralAdvise'] = this.referralAdvise;
    }


    this.httpService.post('order/ticket/refer', body).subscribe(res => {

      if (res.n === 1 && res.nModified === 1) {

        this.dialogRef.close(true);


      } else {
        console.error('-> ', res);
        this.openSnackBar('خطا در ارجاع سفارش به فروشگاه');
      }

    }, err => {
      this.openSnackBar('خطا در ارجاع سفارش به فروشگاه');
    });

  }

  refund() {

  }

  accept() {

  }

  decline() {

  }
}
