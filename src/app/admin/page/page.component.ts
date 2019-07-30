import {Component, OnInit} from '@angular/core';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent extends AbstractSearchComponent implements OnInit {
  constructor(protected httpService: HttpService, protected progressService: ProgressService,
              protected router: Router, protected dialog: MatDialog,
              protected snackBar: MatSnackBar, protected sanitizer: DomSanitizer, protected titleService: TitleService) {
    super(httpService, progressService, router, dialog, snackBar, sanitizer, titleService);
  }

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: صفحه‌ها');
    this.key = 'Page';
    super.ngOnInit();
  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/pages/info/${id}`]);
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
