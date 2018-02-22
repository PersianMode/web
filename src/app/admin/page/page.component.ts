import { Component, OnInit } from '@angular/core';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent extends AbstractSearchComponent  implements OnInit {

  ngOnInit() {
    this.key = 'Page';
    super.ngOnInit();
  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/page/form/${id}`]);
  }

  openView(id: string = null) {
    this.router.navigate([`/agent/page/${id}`]);
  }

  deletePage(id: string = null) {
    this.progressService.enable();
    this.httpService.delete(`collection/${id}`).subscribe(
      (data) => {
        this.searching();
        this.progressService.disable();
      }, (err) => {
        console.log('Error', err);
        this.progressService.disable();
      }
  }

  openForm() {
  }


  openView(id: string = null) {
    // this.router.navigate([`/agent/collections/${id}`]);
  }

  deletePage(id: string = null) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`/page/${id}`).subscribe(
            (data) => {
              this.snackBar.open('Page delete successfully', null, {
                duration: 2000,
              });
              this.progressService.disable();
              this.searching();
            },
            (error) => {
              this.snackBar.open('Cannot delete this page. Please try again', null, {
                duration: 2700
              });
              this.progressService.disable();
            }
          );
        }
      },
      (err) => {
        console.log('Error in dialog: ', err);
      }
    );
  }
}
