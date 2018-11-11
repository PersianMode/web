import {Component, OnInit} from '@angular/core';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar, MatTableDataSource, MatDialog} from '../../../../../../node_modules/@angular/material';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {HttpClient} from '../../../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-free-delivery',
  templateUrl: './free-delivery.component.html',
  styleUrls: ['./free-delivery.component.css']
})
export class FreeDeliveryComponent implements OnInit {
  freeDeliveryDisplayedColumns = ['position', 'province', 'min_price', 'edit', 'remove'];
  freeDeliveryDataSource = new MatTableDataSource();
  provinceList = [];
  freeDeliveryItem = {
    id: null,
    province: null,
    min_price: null
  };

  constructor(private progressService: ProgressService, private httpService: HttpService,
    private snackBar: MatSnackBar, private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit() {
    this.getFreeDeliveryOptions();
    this.getProviceList();
  }

  getFreeDeliveryOptions() {
    this.progressService.enable();
    this.httpService.get('delivery/cost/free').subscribe(
      data => {
        const tempList = [];

        if (data && data.length) {
          let counter = 0;
          data.forEach(el => {
            tempList.push({
              position: ++counter,
              id: el._id,
              province: el.province,
              min_price: el.min_price,
            });
          });
        }

        this.freeDeliveryDataSource.data = tempList;
        this.progressService.disable();
      },
      err => {
        console.error('Error when fetch free delivery options: ', err);
        this.progressService.disable();
        this.snackBar.open('خطایی در هنگام دریافت لیست تحویل های رایگان رخ داده است: ' + err.message, 'بستن');
      });
  }

  getProviceList() {
    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.provinceList = info.map(el => el.name);
      }, err => {
        console.log('err: ', err);
      }
    );
  }

  editFreeDeliveryOption(id) {
    const foundData = this.freeDeliveryDataSource.data.find((el: any) => el.id === id);
    this.freeDeliveryItem = {
      id: id,
      province: foundData['province'],
      min_price: foundData['min_price'],
    };
  }

  removeFreeDeliveryOption(id) {
    if (!id) {
      return;
    }

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
      data: {
        name: 'ارسال رایگان ' + this.freeDeliveryDataSource.data.find((el: any) => el.id === id)['province']
      }
    });

    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.post('delivery/cost/free/delete', {
            id: id,
          }).subscribe(
            data => {
              const currentDataList = this.freeDeliveryDataSource.data.filter((el: any) => el.id !== id);
              let counter = 0;
              currentDataList.forEach(el => {
                el['position'] = ++counter;
              });
              this.clearFreeDeliveryFields();
              this.freeDeliveryDataSource.data = currentDataList;
              this.snackBar.open('مورد انتخابی با موفقیت حذف شد', null, {
                duration: 2000,
              });
              this.progressService.disable();
            },
            err => {
              this.progressService.disable();
              console.error('Error when removing the freeDelivery item: ', err);
              this.snackBar.open('خطایی در هنگام حذف مورد انتخابی رخ داده است. ' + err.message, 'بستن');
            });
        }
      });
  }

  applyFreeDeliveryChanges() {
    if (!this.freeDeliveryItem.province || !this.freeDeliveryItem.min_price) {
      return;
    }

    this.progressService.enable();
    this.httpService.post('delivery/cost/free', this.freeDeliveryItem).subscribe(
      data => {
        if (this.freeDeliveryItem.id) {
          const foundData = this.freeDeliveryDataSource.data.find((el: any) => el.id === this.freeDeliveryItem.id);
          foundData['province'] = this.freeDeliveryItem.province;
          foundData['min_price'] = this.freeDeliveryItem.min_price;
        } else {
          const currentData = this.freeDeliveryDataSource.data;
          currentData.push({
            position: currentData.length + 1,
            id: data,
            province: this.freeDeliveryItem.province,
            min_price: this.freeDeliveryItem.min_price,
          });
          this.freeDeliveryItem.id = data;
          this.freeDeliveryDataSource.data = currentData;
        }
        this.snackBar.open('تغییرات با موفقیت ثبت شد', null, {
          duration: 2000
        });
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('Error when apply free delivery item changes: ', err);
        this.snackBar.open('خطایی در هنگام اعمال تغییرات رخ داده است. ' + err.message, 'بستن');
      });
  }

  clearFreeDeliveryFields() {
    this.freeDeliveryItem = {
      id: null,
      province: null,
      min_price: null
    };
  }
}
