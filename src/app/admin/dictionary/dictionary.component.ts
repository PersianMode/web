import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {HttpService} from '../../shared/services/http.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {
  editSelectedIndex = -1;
  displayedColumns = [
    'remove',
    'edit',
    'value',
    'name',
    'type',
    'number',
  ];
  editElement = { //it is bind to selected row for editing
    type: '',
    name: '',
    value: '',
  };
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  pageSize = 20;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private httpService: HttpService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoadingResults = true;
    //TODO send get request
    // this.httpService.get('../../assets/dictionary.json')
    this.httpService.get('/dictionary')
      .subscribe(res => {
        console.log(res);
        this.isLoadingResults = false;
        this.resultsLength = res.lenght;
        this.dataSource.data = res;
        console.log('-> ', this.dataSource.data);
      }, err => {
        this.isLoadingResults = false;
        this.resultsLength = 0;
        this.openSnackBar('خطا در دریافت دیکشنری');
      });
  }

  plusElement() {
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

  deleteRow(position: number) {
    //TODO send delete request
  }

  saveEdit() {//should get data
    this.editSelectedIndex = -1;
    //TODO send  post request
    //sending editElement datas


    this.editElement.type = '';
    this.editElement.name = '';
    this.editElement.value = '';
  }

  Edit(element: any) {
    this.editSelectedIndex = this.dataSource.data.indexOf(element);
    this.editElement.type = element.type;
    this.editElement.name = element.name;
    this.editElement.value = element.value;
  }

  put() {//should get data
    //TODO send put request
  }

}
