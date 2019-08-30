import {Component, OnInit} from '@angular/core';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {TitleService} from '../../shared/services/title.service';
import {AuthService} from '../../shared/services/auth.service';
import {CheckoutService} from '../../shared/services/checkout.service';
import {Router} from '@angular/router';
import {ProfileOrderService} from '../../shared/services/profile-order.service';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

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
  constructor(protected httpService: HttpService, protected progressService: ProgressService,
              protected router: Router, protected dialog: MatDialog,
              protected snackBar: MatSnackBar, protected sanitizer: DomSanitizer, protected titleService: TitleService) {
    super(httpService, progressService, router, dialog, snackBar, sanitizer, titleService);
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
