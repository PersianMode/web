import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../../../../shared/services/http.service';
import {ProgressService} from '../../../../shared/services/progress.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.css']
})
export class DurationComponent implements OnInit {
  durations = [];
  editBtnShouldDisabled = true;
  selected_duration: any = {};

  @Output() selectedDuration = new EventEmitter();

  constructor(protected router: Router, private httpService: HttpService,
              private progressService: ProgressService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getDurations();
  }

  getDurations() {
    this.progressService.enable();
    this.httpService.get('deliveryduration').subscribe(data => {
      this.durations = data;
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
      name: item.name,
      delivery_days: item.duration_value,
      cities: item.duration_cities,
      delivery_loyalty: item.duration_loyalty_info
    };
    this.selectedDuration.emit(this.selected_duration);
  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/delivery/duration/${id}`]);
  }
}


