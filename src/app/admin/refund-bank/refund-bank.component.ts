import {Component, OnInit, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'jalali-moment';
import {DialogEnum} from 'app/shared/enum/dialog.components.enum';
import {BankRefundFormComponent} from 'app/shared/components/bank-refund-form/bank-refund-form.component';
import {HttpService} from '../../shared/services/http.service';
import {MessageService} from '../../shared/services/message.service';
import {MessageType} from '../../shared/enum/messageType.enum';
import {GenDialogComponent} from '../../shared/components/gen-dialog/gen-dialog.component';
import {AuthService} from '../../shared/services/auth.service';
import {SmRefundFormBankComponent} from './sm-refund-form-bank/sm-refund-form-bank.component';

@Component({
  selector: 'app-refund-bank',
  templateUrl: './refund-bank.component.html',
  styleUrls: ['./refund-bank.component.css']
})
export class RefundBankComponent implements OnInit, AfterViewInit {
  dataTemp;
  dialogEnum = DialogEnum;
  displayedColumns = ['requested_time', 'balance', 'detail', 'status'];
  dataSource: MatTableDataSource<any>;
  statusList = [{status: 1, message: 'در حال بررسی'}, {status: 2, message: 'پرداخت شده'}, {status: 3, message: 'لغو شده'}];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private dialog: MatDialog, private httpService: HttpService,
              private messageService: MessageService, private authService: AuthService) {
  }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  getData() {
    this.httpService.get('refund/get_forms').subscribe(data => {
      this.dataTemp = data;
      console.log('data::', data);
      this.dataSource = new MatTableDataSource(this.mapData(data));
      this.messageService.showMessage('عملیات با موفقیت انجام شد', MessageType.Information);
    }, err => {
      console.log('Cannot get data', err);
      this.messageService.showMessage('در حال حاضر قادر به دریافت اطلاعات نیستیم. دوباره تلاش کنید', MessageType.Error);
    });
  }

  mapData(data) {
    const _data = [];
    if (data.length) {
      data.forEach(refund => {
        const _obj = {
          requested_time: refund.requested_time,
          _id: refund._id,
          balance: refund.amount,
          status: refund.status,
        };
        _data.push(_obj);
      });
    }
    return _data;
  }

  showDetail(_id) {
    console.log(_id);
    console.log(this.dataTemp);
    console.log(this.dataTemp.find(x => x._id === _id));
    const refundForm = this.dialog.open(SmRefundFormBankComponent, {
      width: '500px',
      data: this.dataTemp.find(x => x._id === _id),
    });

    refundForm.afterClosed().subscribe(data => {
        if (data) {
          this.getData();
        }
      }
    );
  }

  getShamsiDate(date) {
    return moment(date).format('jYYYY/jMM/jDD');
  }

  getStatus(status) {
    return this.statusList.filter(s => s.status === status)[0].message;
  }

}
