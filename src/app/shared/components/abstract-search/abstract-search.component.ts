import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {HttpService} from "../../services/http.service";
import {ProgressService} from "../../services/progress.service";
import {Router} from "@angular/router";

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
  searchData: string = null;

  key: string;
  viewName: string;

  constructor(protected httpService: HttpService,
              protected progressService: ProgressService, protected router: Router) {
  }

  ngOnInit() {
    this.searching();
  }

  searching() {
    // I should use a search on this instead of this 'getAllCollections' :D TODO: when search-bar api added
    // this.httpService.search({
    //  phrase: this.searchData,
    //  options: {
    //    target: 'collection',
    //    offset: this.offset ? this.offset : 0,
    //    limit: this.limit ? this.limit : 10,
    // }).subscribe(
    if (this.viewName === 'Collection') {
      this.progressService.enable();
      this.httpService.get('collection').subscribe(
        (data) => {
          data = data.body;
          this.cards = data;
          this.alignRow();
          this.progressService.disable();
        }, (err) => {
          console.log("err", err);
          this.progressService.disable();
        }
      );
    }
    else if (this.viewName === 'Product') {
      this.cards = [
        {
          _id: 'lfsdmfs',
          imgUrl: '../../../../assets/pictures/product-small/11.jpeg',
          name: 'کفش پیاده روی نایک',
          base_price: '155000',
        },
        {
          _id: 'iejpfqemr',
          imgUrl: '../../../../assets/pictures/product-small/12.jpeg',
          name: 'کفش ورزشی آدیداس',
          base_price: '270000',
        },
      ];
      this.alignRow();
    }
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
