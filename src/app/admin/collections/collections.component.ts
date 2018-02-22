import {Component, OnInit} from '@angular/core';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent extends AbstractSearchComponent implements OnInit {

  ngOnInit() {
    this.key = 'Collection';
    super.ngOnInit();

  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/collections/form/${id}`]);
  }

  openView(id: string = null) {
    this.router.navigate([`/agent/collections/${id}`]);
  }

  deleteCollection(id: string = null) {
    this.progressService.enable();
    this.httpService.delete(`collection/${id}`).subscribe(
      (data) => {
        this.searching();
        this.progressService.disable();
      }, (err) => {
        console.log('Error', err);
        this.progressService.disable();
      }
    );
  }
}
