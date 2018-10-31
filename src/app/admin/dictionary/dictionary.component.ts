import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {ProgressService} from '../../shared/services/progress.service';
import {HttpService} from '../../shared/services/http.service';
import {IDictionary} from './interfaces/IDictionary.interface';
import {ModifyDictionaryComponent} from './components/modify-dictionary/modify-dictionary.component';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {
  types;
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

  constructor(private httpService: HttpService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private progressService: ProgressService, private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: دیکشنری');
    this.load();
  }

  load() {
    this.isLoadingResults = true;
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
              this.openSnackBar('مدخل با موفقیت پاک شد');
              this.isLoadingResults = false;
              this.progressService.disable();
            },
            err => {
              this.isLoadingResults = false;
              this.openSnackBar('خطا در پاک کردن مدخل');
              this.progressService.disable();
            }
          );
          this.load();
        }
      }, err => {
        console.log('Error in dialog: ', err);
      });
  }

  updateElement(element: IDictionary) {
    const updateDicDialog = this.dialog.open(ModifyDictionaryComponent, {
      width: '600px;',
      data: {
        types: this.types,
        item: element
      }
    });
    updateDicDialog.afterClosed().subscribe(
      data => {
        if (data && data.status) {
          this.openSnackBar('مدخل با موفقیت بروزرسانی شد');
          this.isLoadingResults = false;
          this.load();
        }
      },
      err => {
        this.isLoadingResults = false;
        this.openSnackBar('خطا در پاک کردن مدخل');
      });
  }

  addDictionary() {
    const addDicDialog = this.dialog.open(ModifyDictionaryComponent, {
      width: '600px;',
      data: {
        types: this.types
      }
    });
    addDicDialog.afterClosed().subscribe(
      data => {
        if (data && data.status) {
          this.openSnackBar('مدخل با موفقیت ثبت شد');
          this.isLoadingResults = false;
          this.load();
        }
      },
      err => {
        this.isLoadingResults = false;
        this.openSnackBar('خطا در پاک کردن مدخل');
      });
  }

  isColor(element) {
    if (element.type != 'color')
      return false;
    return !((element.value.length !== 7 && element.value.length !== 4) || element.value.charAt(0) !== '#');
  }

}
