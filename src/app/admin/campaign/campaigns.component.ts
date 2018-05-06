import {Component, OnDestroy, OnInit} from '@angular/core';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';
import {AbstractSearchComponent} from '../../shared/components/abstract-search/abstract-search.component';


@Component({
  selector: 'app-campaings',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent extends AbstractSearchComponent implements OnInit, OnDestroy {

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

  deletecampaign(id: string = null): void {
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
              this.snackBar.open('Campaign deleted successfully', null, {
                duration: 2000,
              });
              this.searching();
              this.progressService.disable();
            },
            (error) => {
              this.snackBar.open('Cannot delete this campaign. Please try again', null, {
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
