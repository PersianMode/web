import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {HttpService} from '../../shared/services/http.service';
import {MessageType} from '../../shared/enum/messageType.enum';
import * as moment from 'jalali-moment';
import {MessageService} from '../../shared/services/message.service';
import {ProgressService} from '../../shared/services/progress.service';
import {PrintService} from '../../shared/services/print.service';

@Component({
  selector: 'app-daily-sales-report',
  templateUrl: './daily-sales-report.component.html',
  styleUrls: ['./daily-sales-report.component.css']
})
export class DailySalesReportComponent implements OnInit {
  orderNumber = [];
  total = 0;
  totalRecords = 0;
  position;
  displayedColumns = ['position', 'order_time', 'total_amount', 'total_order_lines', 'customer_name'];
  printButton = false;
  dataSource: MatTableDataSource<any>;

  constructor(private dialog: MatDialog, private httpService: HttpService,
              private messageService: MessageService, private progressService: ProgressService, private printService: PrintService) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.progressService.enable();
    this.httpService.get('daily_sales_report').subscribe(data => {
      console.log('data report', data);

      this.dataSource = new MatTableDataSource(data);
      this.orderNumber = data;
      if(data.length) {
        this.printButton = true;
        this.total = 0;
        data.forEach(x => { return this.total += x.total_amount});
      }
      else {
        this.total = 0;
        this.printButton = false;
      }

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

  printReport(data) {
  this.printService.dailySalesReportPrint(data);
  }
}
