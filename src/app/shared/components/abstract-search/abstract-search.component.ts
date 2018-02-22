import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {ProgressService} from '../../services/progress.service';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-abstract-search',
  template: ``,
  styles: []
})
export class AbstractSearchComponent implements OnInit {

  cards: any = null;
  selectedId: string = null;
  rows: any = [];

  offset = 0;
  limit = 10;
  totalCards: number = null;
  searchData: any = null;
  initSearchData: any = null;
  key: string;

  constructor(protected httpService: HttpService, protected progressService: ProgressService,
              protected router: Router, protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.initSearchData = this.searchData;
    this.searching();
  }

  searching() {
    this.progressService.enable();

    this.searchData = this.searchData ? this.searchData : {options: {phrase : ''}};

    let data = Object.assign({
      offset: this.offset ? this.offset : 0,
      limit: this.limit ? this.limit : 10,
    }, this.searchData);

    this.httpService.post(`search/${this.key}`, data).subscribe(
      (resData) => {
        console.log('----->', data);
        data = resData.body.data;
        this.cards = data;
        this.totalCards = resData.body.total ? parseInt(resData.body.total) : 0;
        this.alignRow();
        this.progressService.disable();
      }, (err) => {
        console.log('err', err);
        this.progressService.disable();
      }
    );
  }

  alignRow() {
    if (this.totalCards <= 0) {
      this.rows = [];
      return;
    }
    this.rows = [];
    let chunk = [], counter = 0;
    for (const c in this.cards) {
      if (this.cards.hasOwnProperty(c)) {
        chunk.push(this.cards[c]);
        counter++;

        if (counter >= 4) {
          counter = 0;
          this.rows.push(chunk);
          chunk = [];
        }
      }
    }
    if (counter > 0) {
      this.rows.push(chunk);
    }
  }

  select(id) {
    if (this.selectedId === id) {
      this.selectedId = null;
    } else {
      this.selectedId = id;
    }
  }

  search(data) {
    this.searchData = data;
    this.selectedId = null;
    this.searching();
  }

  changeOffset(data) {
    this.limit = data.pageSize ? data.pageSize : 10;
    this.offset = data.pageIndex * this.limit;
    this.searching();
  }
}
