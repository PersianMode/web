import {Component, OnDestroy, OnInit} from '@angular/core';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {TitleService} from '../../shared/services/title.service';


@Component({
  selector: 'app-campaings',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent extends AbstractSearchComponent implements OnInit, OnDestroy {

  constructor(protected httpService: HttpService, protected progressService: ProgressService,
              protected router: Router, protected dialog: MatDialog,
              protected snackBar: MatSnackBar, protected sanitizer: DomSanitizer, protected titleService: TitleService) {
    super(httpService, progressService, router, dialog, snackBar, sanitizer, titleService);
  }

  ngOnInit() {
    this.key = 'Campaign';
    super.ngOnInit();
  }

  openForm(id: string = null) {
    if (id)
      this.router.navigate([`/agent/campaigns/campaignInfo/${id}`]);
    else
      this.router.navigate([`/agent/campaigns/campaignInfo/`]);
  }


  getCampaignStatus(campaign): boolean {
    const now = new Date();
    if (campaign.end_date) {
      const end = new Date(campaign.end_date);
      return end > now;
    } else {
      return true;
    }
  }

  endCampaign(id: string = null): void {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });
    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`/campaign/${id}`).subscribe(
            (data) => {
              this.selectedId = null;
              this.snackBar.open('کمپین با موفقیت به پایان رسید', null, {
                duration: 2000,
              });
              this.searching();
              this.progressService.disable();
            },
            (error) => {
              this.snackBar.open('خطا در اتمام کمپین. لطفا مجددا تلاش کنید', null, {
                duration: 2700
              });
              this.progressService.disable();
            });
        }
      },
      (err) => {
        console.log('Error in dialog: ', err);
      });
  }

  ngOnDestroy() {
  }
}
