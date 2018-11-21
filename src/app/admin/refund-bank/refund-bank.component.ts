import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator, MatDialog} from '@angular/material';
import * as moment from 'jalali-moment';
import { DialogEnum } from 'app/shared/enum/dialog.components.enum';
import { BankRefundFormComponent } from 'app/shared/components/bank-refund-form/bank-refund-form.component';

@Component({
  selector: 'app-refund-bank',
  templateUrl: './refund-bank.component.html',
  styleUrls: ['./refund-bank.component.css']
})
export class RefundBankComponent implements OnInit, AfterViewInit {
  dialogEnum = DialogEnum;
  displayedColumns = ['position', 'date', 'credit', 'detail', 'status'];
  dataSource: MatTableDataSource<any>;
  statusList = [{status: 1, message: 'انجام شده'}, {status: 2, message: 'لغو شده'}, {status:3, message: 'از دسترس خارج بودن'}];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  showDetail() {
    this.dialog.open(BankRefundFormComponent, {
      width: '500px',
      data: {
        componentName: this.dialogEnum.refundBank,
      }
    });
  }

  getShamsiDate(date) {
    return moment(date).format('jYYYY/jMM/jDD');
  }

  getStatus(status) {
    return this.statusList.filter(s => s.status === status)[0].message;
  }

}

const ELEMENT_DATA = [
  {position: 1, date: new Date(), credit: 1.0079, status: 1},
  {position: 2, date: new Date(), credit: 4.0026, status: 2},
  {position: 3, date: new Date(), credit: 6.941, status: 2},
  {position: 4, date: new Date(), credit: 9.0122, status: 3},
  {position: 5, date: new Date(), credit: 10.811, status: 2},
  {position: 6, date: new Date(), credit: 12.0107, status: 3},
  {position: 7, date: new Date(), credit: 14.0067, status: 3},
  {position: 8, date: new Date(), credit: 15.9994, status: 2},
  {position: 9, date: new Date(), credit: 18.9984, status: 2},
  {position: 10, date: new Date(), credit: 20.1797, status: 3},
  {position: 11, date: new Date(), credit: 22.9897, status: 3},
  {position: 12, date: new Date(), credit: 24.305, status: 3},
  {position: 13, date: new Date(), credit: 26.9815, status: 1},
  {position: 14, date: new Date(), credit: 28.0855, status: 1},
  {position: 15, date: new Date(), credit: 30.9738, status: 1},
  {position: 16, date: new Date(), credit: 32.065, status: 2},
  {position: 17, date: new Date(), credit: 35.453, status: 3},
  {position: 18, date: new Date(), credit: 39.948, status: 1},
  {position: 19, date: new Date(), credit: 39.0983, status: 1},
  {position: 20, date: new Date(), credit: 40.078, status: 3},
];
