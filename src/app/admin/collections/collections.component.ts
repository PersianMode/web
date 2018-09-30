import {Component, OnInit} from '@angular/core';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent extends AbstractSearchComponent implements OnInit {

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: ' + TitleService.collection_name);
    this.key = 'Collection';
    super.ngOnInit();

  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/collections/form/${id ? id : '' }`]);
  }

  openView(id: string = null) {
    this.router.navigate([`/agent/collections/${id}`]);
  }

  deleteCollection(id: string = null) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px'
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`collection/${id}`).subscribe(
            (data) => {
              this.selectedId = null;
              this.snackBar.open('Collection deleted successfully', null, {
                duration: 2000,
              });
              this.searching();
              this.progressService.disable();
            }, (err) => {
              this.snackBar.open('Cannot delete this product. Please try again.', null, {
                duration: 2700,
              });
              console.log('Error', err);
              this.progressService.disable();
            });
        }
      }, err => {
        console.log('Error in dialog: ', err);
      });
  }
}
