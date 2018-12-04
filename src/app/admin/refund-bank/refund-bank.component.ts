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
import {forEach} from '@angular/router/src/utils/collection';
import {ProgressService} from '../../shared/services/progress.service';

@Component({
  selector: 'app-refund-bank',
  templateUrl: './refund-bank.component.html',
  styleUrls: ['./refund-bank.component.css']
})
export class RefundBankComponent implements OnInit {
  limit: any = 10;
  offset: any = 0;
  dataTemp;
  totalRecords = 0;
  filterStatus = [];
  position;
  _status = null;
  dialogEnum = DialogEnum;
  displayedColumns = ['position', 'requested_time', 'balance', 'detail', 'status'];
  dataSource: MatTableDataSource<any>;
  statusList = [{status: 1, message: 'در حال بررسی'}, {status: 2, message: 'پرداخت شده'}, {status: 3, message: 'لغو شده'}];

  constructor(private dialog: MatDialog, private httpService: HttpService,
              private messageService: MessageService, private progressService: ProgressService) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.progressService.enable();
    this.httpService.get('refund/get_forms/' + (this.offset ? this.offset : 0) + '/' + (this.limit ? this.limit : 10)).subscribe(data => {
      this.dataTemp = data.result;
      this.filterStatus = this.dataTemp(s => s.status === 2 || 3);
      console.log('filterStatusz',this.filterStatus);
      this.dataSource = new MatTableDataSource(this.mapData(data.result));
      this.totalRecords = data && data.total ? data.total : 0;
      this.progressService.disable();

    }, err => {
      console.log('Cannot get data', err);
      this.messageService.showMessage('در حال حاضر قادر به دریافت اطلاعات نیستیم. دوباره تلاش کنید', MessageType.Error);
      this.progressService.disable();
    });
  }

  mapData(data) {
    let counter = this.offset
    const _data = [];
    if (data.length) {
      data.forEach(refund => {
        const _obj = {
          position: ++counter,
          requested_time: refund.requested_time,
          _id: refund._id,
          balance: refund.amount,
          status: refund.status,
          customer_id: refund.customer_id,
        };
        _data.push(_obj);
      });
    }
    console.log('data:::',_data);
    return _data;
  }

  showDetail(_id) {
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

  formatter(p) {
    return (+p).toLocaleString('fa');
  }

  getStatus(status) {
    return this.statusList.filter(s => s.status === status)[0].message;
  }

  changeStatus() {
    console.log('filterStatus', this.filterStatus);
    if (this._status === null) {
      this._status = true;
      this.getData();
    }
    if (this._status === true) {
      this._status = false;
    }

  }

  changePageSetting(data) {
    this.limit = data.pageSize ? data.pageSize : 10;
    this.offset = data.pageIndex * this.limit;

    this.getData();
  }

}
