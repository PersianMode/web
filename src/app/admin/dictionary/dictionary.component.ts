import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {ProgressService} from '../../shared/services/progress.service';
import {HttpService} from '../../shared/services/http.service';
import {IDictionary} from './interfaces/IDictionary.interface';
import { AddDictionaryComponent } from './components/add-dictionary/add-dictionary.component';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {
  types;
  editSelectedIndex = -1;
  displayedColumns = [
    'remove',
    'edit',
    'value',
    'name',
    'type',
    'number',
  ];
  editElement = { // it is bind to selected row for editing
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
              private snackBar: MatSnackBar,
              private progressService: ProgressService) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoadingResults = true;
    // TODO send get request
    // this.httpService.get('../../assets/dictionary.json')
    this.httpService.get('/dictionary')
      .subscribe(res => {
        this.types = Array.from(new Set(res.map(el => el.type)));
        this.isLoadingResults = false;
        this.resultsLength = res.lenght;
        this.dataSource.data = res;
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

  deleteElement(element: IDictionary) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px'
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          // TODO send delete request
          this.httpService.delete(`/dictionary/${element._id}`).subscribe(
            res => {
              this.openSnackBar('دیکشنری با موفقیت پاک گردید');
              this.isLoadingResults = false;
            },
            err => {
              this.isLoadingResults = false;
              this.openSnackBar('خطا در پاک کردن دیکشنری');
            }
          );
          this.load();
        }
      }, err => {
        console.log('Error in dialog: ', err);
      });
  }

  updateElement(element: IDictionary) {
    const updateDicDialog = this.dialog.open(AddDictionaryComponent, {
          width: '600px;',
      data: {
        types: this.types,
        item: element
      }
    });
    updateDicDialog.afterClosed().subscribe(
      res => {
        this.openSnackBar('دیکشنری با موفقیت بروزرسانی گردید');
        this.isLoadingResults = false;
        this.load();
      },
      err => {
        this.isLoadingResults = false;
        this.openSnackBar('خطا در پاک کردن دیکشنری');
      });
  }
  saveEdit() {// should get data
    this.editSelectedIndex = -1;
    // TODO send  post request
    // sending editElement datas


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

  put() {
     // should get data
    // TODO send put request
  }

  addDictionary() {
    const addDicDialog =  this.dialog.open(AddDictionaryComponent, {
      width: '600px;',
      data: {
        types: this.types
      }
    });
    addDicDialog.afterClosed().subscribe(
      res => {
        this.openSnackBar('دیکشنری با موفقیت ثبت گردید');
        this.isLoadingResults = false;
        this.load();
      },
      err => {
        this.isLoadingResults = false;
        this.openSnackBar('خطا در پاک کردن دیکشنری');
      });
    }
}
