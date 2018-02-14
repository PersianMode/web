import {Component, OnInit} from '@angular/core';

import {AuthService} from "../../shared/services/auth.service";
// import {HttpService} from "../../shared/services/http.service";
import {Router} from "@angular/router";
import {ProgressService} from "../../shared/services/progress.service";

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  collections: any[] = [];
  selectedId: string = null;
  rows: any = [];

  constructor(private authService: AuthService, private router: Router,
              private progressService: ProgressService) { }

  ngOnInit() {
    this.searching();
  }

  searching() {
    this.progressService.enable();
    //I should use a search on this instead of this 'getAllCollections' :D TODO: when search-bar api added
    this.authService.getAllCollections().subscribe(
      (data) => {
        data = data.body;
        this.collections = data;
        this.alignRow();
        this.progressService.disable();
      }, (err) => {
        console.log("err", err);
        this.progressService.disable();
      }
    );
  }

  alignRow() {
    this.rows = [];
    let chunk = [], counter = 0;
    for(let c in this.collections) {
      if(this.collections.hasOwnProperty(c)) {
        chunk.push(this.collections[c]);
        counter ++;

        if(counter >= 4) {
          counter = 0;
          this.rows.push(chunk);
          chunk = [];
        }
      }
    }
    if(counter > 0) {
      this.rows.push(chunk);
    }
  }

  select(id) {
    if (this.selectedId === id) {
      this.selectedId = null;
    }
    else {
      this.selectedId = id;
    }
  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/collections/form/${id}`]);
  }

  openView(id: string = null) {
    this.router.navigate([`/agent/collections/${id}`]);
  }

  deleteCollection(id: string = null) {
    this.progressService.enable();
    this.authService.deleteCollection(id).subscribe(
      (data) => {
        this.searching();
        this.progressService.disable();
      }, (err) => {
        console.log("Error", err);
        this.progressService.disable();
      }
    );
  }

  search(data) {
    //TODO: when search API was created
  }
}
