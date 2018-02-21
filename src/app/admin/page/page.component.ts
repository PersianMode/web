import { Component, OnInit } from '@angular/core';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent extends AbstractSearchComponent implements OnInit {

  // constructor() { }

  ngOnInit() {
    this.key = 'Page';
    super.ngOnInit();
  }
  openForm() {
  }


  openView(id: string = null) {
    // this.router.navigate([`/agent/collections/${id}`]);
  }

  deleteCollection(id: string = null) {
    // this.progressService.enable();
    // this.httpService.delete(`collection/${id}`).subscribe(
    //   (data) => {
    //     this.searching();
    //     this.progressService.disable();
    //   }, (err) => {
    //     console.log('Error', err);
    //     this.progressService.disable();
    //   }
    // );
  }
}
