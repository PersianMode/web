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
  deliveryDurations = [
    // {
    //   name: 'سه روزه', value: 3,
    //   cities: [{
    //     name: 'تهران',
    //     value: 'Tehran'
    //   }],
    //   loyalty_points: [
    //     {Golden: 5000}, {silver: 2500}, {buroonze: 1000}
    //   ]
    // }
  ];
  durationObject: any = {};
  editBtnShouldDisabled = true;

  @Output() selectedDuration = new EventEmitter();

  constructor(protected router: Router, private httpService: HttpService,
              private progressService: ProgressService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getDeliveryDurations();
  }

  getDeliveryDurations() {
    this.progressService.enable();
    this.httpService.get('deliveryduration').subscribe(data => {
      this.deliveryDurations = data;
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
    console.log('select item :', item);
    this.editBtnShouldDisabled = false;
    this.durationObject = {
      duration_id: item._id,
      name: item.name,
      duration_value: item.duration_value,
      duration_cities: item.duration_cities,
      duration_loyalty_info: item.duration_loyalty_info
    };
    this.selectedDuration.emit(this.durationObject);
  }

  openForm(id: string = null) {
    this.router.navigate([`/agent/delivery/duration/${id}`]);
  }
}


