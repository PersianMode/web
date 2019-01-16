import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {HttpService} from 'app/shared/services/http.service';
import {ProgressService} from 'app/shared/services/progress.service';
import {DeliveryStatuses} from 'app/shared/lib/status';

@Component({
  selector: 'app-return-delivery-generator',
  templateUrl: './return-delivery-generator.component.html',
  styleUrls: ['./return-delivery-generator.component.css']
})
export class ReturnDeliveryGeneratorComponent implements OnInit {

  address_parts = [
    {
      name: 'province',
      fa_name: 'استان',
    },
    {
      name: 'city',
      fa_name: 'شهر',
    },
    {
      name: 'district',
      fa_name: 'منطقه',
    },
    {
      name: 'street',
      fa_name: 'خیابان',
    },
    {
      name: 'no',
      fa_name: 'پلاک',
    },
    {
      name: 'unit',
      fa_name: 'واحد',
    },
    {
      name: 'postal_code',
      fa_name: 'کد پستی',
    },
  ];

  delivery: any = null;
  address: any = false;

  constructor(private dialogRef: MatDialogRef<ReturnDeliveryGeneratorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService,
    private progressService: ProgressService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {

    this.httpService.post('sm/assignToReturn', {
      customerId: this.data.message.customer._id,
      addressId: this.data.message.extra.address_id,
      preCheck: true
    }).subscribe(res => {
      this.progressService.disable();
      this.delivery = res.delivery;
      this.address = res.address;

      if (!this.address) {
        this.openSnackBar('آدرسی برای این پیام یافت نشد');
        this.dialogRef.close();
      }

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در دریافت آدرس و اطلاعات ارسال');
      this.dialogRef.close();
    });

  }

  getDeliveryStatus() {
    try {
      return DeliveryStatuses.find(x => this.delivery.tickets[this.delivery.tickets.length - 1].status === x.status).name;
    } catch (err) {
    }
  }

  getAdressPart(name) {
    try {
      return this.address[name];
    } catch (err) {
      return '-';
    }
  }
  process() {
    const orderId = this.data.message.order._id;
    const orderLineId = this.data.message.order.order_lines._id;

    if (!orderId || !orderLineId) {
      this.openSnackBar('کالای بازگشتی مشخص نیست');
      return;
    }

    this.httpService.post('sm/assignToReturn', {
      id: this.data.message._id,
      customerId: this.data.message.customer._id,
      addressId: this.data.message.extra.address_id,
      orderId: this.data.message.order._id,
      orderLineId: this.data.message.order.order_lines._id,
      preCheck: false
    }).subscribe(res => {
      this.progressService.disable();
      this.openSnackBar('تخصیص به ارسال با موفقیت انجام شد');

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در دریافت آدرس و اطلاعات ارسال');
      this.dialogRef.close();
    });


  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }


  close() {
    this.dialogRef.close();
  }
}
