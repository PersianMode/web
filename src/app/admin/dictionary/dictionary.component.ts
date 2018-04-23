import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {AuthService} from '../../shared/services/auth.service';
import {HttpService} from '../../shared/services/http.service';
import {SocketService} from '../../shared/services/socket.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {

  displayedColumns = [
    'remove',
    'edit',
    'value',
    'name',
    'type',
    'number',
  ];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  pageSize = 20;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  processDialogRef;

  constructor(private httpService: HttpService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private  authService: AuthService,
              private  socketService: SocketService) {
  }

  ngOnInit() {
    this.load();
    this.socketService.getOrderLineMessage().subscribe(msg => {
      if (this.processDialogRef)
        this.processDialogRef.close();

      this.load();
    });
  }

  load() {
    this.isLoadingResults = true;
    const options = {
      output: true,
      sort: this.sort.active,
      dir: this.sort.direction,
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('/Order', {options, offset, limit}).subscribe(res => {
      this.isLoadingResults = false;
      this.resultsLength = res.total;
      this.dataSource.data = res.data;
      console.log('-> ', this.dataSource.data);
    }, err => {
      this.isLoadingResults = false;
      this.resultsLength = 0;
      this.openSnackBar('خطا در دریافت دیکشنری');
    });
  }

  getIndex(element) {
    return this.dataSource.data.indexOf(element) + 1;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  onSortChange($event: any) {

    this.paginator.pageIndex = 0;
    this.load();
  }

  onPageChange($event: any) {
    this.load();
  }


}
