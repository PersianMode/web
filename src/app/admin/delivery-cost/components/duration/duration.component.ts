import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.css']
})
export class DurationComponent implements OnInit {
  durations = [];
  _id;
  editBtnShouldDisabled = true;
  selected_duration: any = {};

  @Output() selectedDuration = new EventEmitter();
  @Input() durationId;

  constructor(protected router: Router, private httpService: HttpService,
              private progressService: ProgressService,
              private dialog: MatDialog, private snackBar: MatSnackBar, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getDurations();
  }

  getDurations(id: string = null) {
    this.progressService.enable();
    this.httpService.get('deliveryduration').subscribe(data => {
      this.durations = data;
      this.route.params.subscribe(
        (params) => {
          this._id = params['id'] && params['id'] !== 'null' ? params['id'] : null;
          if (this._id || this.durationId) {
            this._id = this._id ? this._id : this.durationId;
            const item = data.filter(el => el._id === this._id);
            if (item) this.changeDuration(item[0]);
          }
        }
      );
      this.progressService.disable();
    }, err => {
      this.progressService.disable();
      console.error('Cannot get loyalty groups: ', err);
      this.snackBar.open('سیستم قادر به دریافت اطلاعات بازه های زمانی ارسال نیست. دوباره تلاش کنید', null, {
        duration: 3200,
      });
    });
  }

  changeDuration(item) {
    this.editBtnShouldDisabled = false;
    this.selected_duration = {
      _id: item._id,
      is_c_and_c: false,
      name: item.name,
      delivery_days: item.delivery_days,
      cities: item.cities,
      delivery_loyalty: item.delivery_loyalty
    };
    this.selectedDuration.emit(this.selected_duration);
  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/deliverycost/duration/${id}`]);
  }

  removeDuration(id) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
    });

    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.delete(`deliveryduration/delete/${id}`).subscribe(
            data => {
              this.editBtnShouldDisabled = true;
              this.selected_duration = {};
              this.selectedDuration.emit(null);
              this.durations = this.durations.filter(el => el._id !== id);
              this.snackBar.open('بازه زمانی مورد نظر با موفقیت حذف شد', null, {
                duration: 2300,
              });
              this.progressService.disable();

            },
            er => {
              console.error('Cannot remove selected item: ', er);
              this.snackBar.open('سیستم قادر به حذف این بازه زمانی نیست. دوباره تلاش کنید', null, {
                duration: 3200,
              });
              this.progressService.disable();
            });
        }
      },
      err => {
        console.error('Error when subscribing on rmDialog.afterClosed() function: ', err);
      });
  }
}
