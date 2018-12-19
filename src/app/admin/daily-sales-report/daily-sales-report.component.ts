import { Component, OnInit } from '@angular/core';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {HttpService} from '../../shared/services/http.service';
import {MessageType} from '../../shared/enum/messageType.enum';
import * as moment from 'jalali-moment';
import {MessageService} from '../../shared/services/message.service';
import {ProgressService} from '../../shared/services/progress.service';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-daily-sales-report',
  templateUrl: './daily-sales-report.component.html',
  styleUrls: ['./daily-sales-report.component.css']
})
export class DailySalesReportComponent implements OnInit {
  dataTemp;
  index = [];
  totalRecords = 0;
  position;
  displayedColumns = ['position', 'order_time', 'total_amount', 'total_order_lines', 'customer_name'];

  dataSource: MatTableDataSource<any>;

  constructor(private dialog: MatDialog, private httpService: HttpService,
              private messageService: MessageService, private progressService: ProgressService) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.progressService.enable();
    this.httpService.get('daily_sales_report').subscribe(data => {
      console.log('data report', data);
      // let currentDate = moment();
      // let prevDay = currentDate.add(-1, 'd');
      // console.log('previous day',prevDay.format('YYYY-MM-DD HH:mm'));

      this.dataSource = new MatTableDataSource(data);
      // this.dataTemp =  data;
      // for(let i = 0 ; i < this.dataTemp.length; i++)
      // {this.index[i] = i + 1;}
      // console.log('index', this.index);
      // let i = 0
      // this.dataTemp = data.forEach(x =>
      // { x.push( {index : i});
      //  i++;
      // });
      // console.log('temp: ',this.dataTemp);
      this.totalRecords = data && data.total ? data.total : 0;
      this.progressService.disable();

    }, err => {
      console.log('Cannot get data', err);
      this.messageService.showMessage('در حال حاضر قادر به دریافت اطلاعات نیستیم. دوباره تلاش کنید', MessageType.Error);
      this.progressService.disable();
    });
  }

  getShamsiDate(date) {
    return moment(date).format('jYYYY/jMM/jDD HH:mm:ss');
  }

}
