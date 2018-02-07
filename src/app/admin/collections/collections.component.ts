import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {HttpService} from "../../shared/services/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  collections: any[] = [];
  selectedId: string = null;
  rows: any = [];

  constructor(private authService: AuthService, private httpService: HttpService,
              private router: Router) { }

  ngOnInit() {
    this.searching();
  }

  searching() {
    //this.authService.getAllCollections().subscribe(
    this.httpService.getMockCollections().subscribe(
      (data) => {
        this.collections = []; this.rows = [];
        data = data.body.collections;
        for(let d in data) {
          let col = {
            id: data[d].id,
            name: data[d].name,
            image_url: {
              url: data[d].image_url.url,
              alt: data[d].image_url.alt
            }
          };
          col['products'] = [];
          for(let p in data[d].products) {
            col['products'].push({
              name: data[d].products[p].name
            });
          }
          this.collections.push(col);
        }
        console.log(this.collections);
        this.alignRow();
      }
    );
  }

  alignRow() {
    //TODO: should be multiple per row not all in one row - after paginator added
    this.rows.push(this.collections);
  }

  select(id) {
    if(this.selectedId == id)
      this.selectedId = null;
    else
      this.selectedId = id;
  }

  openForm(id: string = null) {
    this.router.navigate([`/admin/collections/form/${id}`]);
  }

  openView(id: string = null) {
    this.router.navigate([`/admin/collections/${id}`]);
  }

  deleteCollection(id: string = null) {
    //call DELETE api for /collection/:cid
    this.authService.deleteCollection(id);
    this.searching();
  }
}
