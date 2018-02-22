import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {ProgressService} from '../../services/progress.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {RemovingConfirmComponent} from '../removing-confirm/removing-confirm.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-abstract-search',
  template: ``,
  styles: []
})
export class AbstractSearchComponent implements OnInit {

  cards: any = null;
  selectedId: string = null;
  rows: any = [];
  totalCards: number = null;
  cardId: number = null;


  offset = 0;
  limit = 10;
  searchData: string = null;

  key: string;

  constructor(protected httpService: HttpService,
              protected progressService: ProgressService, protected router: Router,
              protected activatedRoute: ActivatedRoute, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.searching();
  }

  open(id: number = null) {
    this.cardId = id;
    this.router.navigate(['/' + id], {relativeTo: this.activatedRoute});
  }

  deleteCard(id: number = null, name = ''): Observable<any> {
    this.cardId = id;
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
      data: {
        name: name,
      }
    });

    return rmDialog.afterClosed();
  }

  searching() {
    this.progressService.enable();
    this.httpService.post(`search/${this.key}`, {
      offset: this.offset ? this.offset : 0,
      limit: this.limit ? this.limit : 10,
      options: {
        phrase: this.searchData,
      }
    }).subscribe(
      (data) => {
        data = data.body;
        this.cards = data;
        this.alignRow();
        this.progressService.disable();
      }, (err) => {
        console.log('err', err);
        this.progressService.disable();
      }
    );
  }

  alignRow() {
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
