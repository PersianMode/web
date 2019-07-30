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


    // this.filter_options$ = this.productService.filtering$.subscribe(r => {
    //   this.allCount = this.productService.countProducts().toLocaleString('fa');
    //   this.filter_options = r;
    //   this.filter_options.forEach(el => {
    //     if (this.sideOptions.length) {
    //       this.sideOptions.forEach(so => {
    //         so.count = this.productService.countProducts(so.name, so.value);
    //         so.countFa = so.count.toLocaleString('fa');
    //       });
    //     } else this.productService.side$.next(r);
    //     const found = this.current_filter_state.find(cfs => cfs.name === el.name);
    //     if (!found) {
    //       this.current_filter_state.push({name: el.name, values: []});
    //     }
    //     if (!this.isChecked[el.name]) {
    //       this.isChecked[el.name] = {};
    //       for (const key of el.values) {
    //         this.isChecked[el.name][key] = false;
    //       }
    //     }
    //   });
    // });

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
