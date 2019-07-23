import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {ProgressService} from '../../shared/services/progress.service';
import {HttpService} from '../../shared/services/http.service';
import {TitleService} from '../../shared/services/title.service';
import {imagePathFixer} from '../../shared/lib/imagePathFixer';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-sold-out',
  templateUrl: './soldout.component.html',
  styleUrls: ['./soldout.component.css']
})
export class SoldOutComponent implements OnInit {
  types;
  displayedColumns = [
    'edit',
    'articleNo',
    'barcode',
    'size',
    'name',
    'thumbnail',
  ];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  pageSize = 3;
  phrase = '';
  offset = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  soldOutCtrl: FormControl;

  constructor(private httpService: HttpService,
              private snackBar: MatSnackBar,
              private progressService: ProgressService, private titleService: TitleService) {
    this.soldOutCtrl = new FormControl();
  }

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: محصولات تمام شده');
    this.load();
    this.soldOutCtrl.valueChanges.debounceTime(500).subscribe(t => this.load());
  }

  load() {
    this.progressService.enable();
    this.httpService.post('search/SoldOut', {
      options: {
        phrase: this.phrase
      },
      offset: this.offset,
      limit: this.pageSize
    })
      .subscribe(res => {
        this.progressService.disable();
        this.resultsLength = res.total;
        console.log('-> ', res);
        this.dataSource.data = res.data;
      }, err => {
        this.progressService.disable();
        this.resultsLength = 0;
        this.openSnackBar('خطا در دریافت لیست محصولات تمام شده');
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
    this.offset = $event.pageIndex * this.pageSize;
    this.load();
  }

  getPIThumbnail(element: any) {
    const color = element.product.colors.find(x => x._id === element.product.instances.product_color_id);
    if (color && color.image.thumbnail)
      return imagePathFixer(color.image.thumbnail, element.product._id, color._id);
  }

  changeSoldOutStatus(element, soldOutStatus) {
    this.progressService.enable();
    this.httpService.post('soldout/setFlag', {
      productId: element.product._id,
      productInstanceId: element.product.instances._id,
      soldOutStatus
    }).subscribe(res => {
      this.progressService.disable();
      this.openSnackBar(soldOutStatus ? 'محصول نمایش نداده خواهد شد' : 'محصول نمایش داده خواهد شد')
      this.load();
    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در بروز رسانی وضعیت محصول');
    });
  }

}
