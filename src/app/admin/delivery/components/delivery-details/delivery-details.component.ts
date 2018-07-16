import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import * as moment from 'moment';
import {SaveChangeConfirmComponent} from '../../../../shared/components/save-change-confirm/save-change-confirm.component';
import {ProgressService} from '../../../../shared/services/progress.service';
import {ExpiredDateDialogComponent} from '../expired-date-dialog/expired-date-dialog.component';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.css']
})
export class DeliveryDetailsComponent implements OnInit {
  deliveryAgentList = [];
  isHubClerk = false;
  deliveryAgentId = null;
  start_date = null;
  start_time = {
    m: null,
    h: null,
  };
  end_date = null;
  end_time = {
    m: null,
    h: null,
  };

  constructor(private dialogRef: MatDialogRef<DeliveryDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService, private dialog: MatDialog, private progressService: ProgressService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.deliveryAgentList = this.data.agentList;
    this.isHubClerk = this.data.isHubClerk;
    this.data = this.data.deliveryItem;
    this.deliveryAgentId = this.data.delivery_agent ? this.data.delivery_agent._id : null;

    this.start_date = this.data.start ? this.data.start : null;
    this.start_time = {
      h: this.data.start ? +moment(this.data.start).format('HH') : null,
      m: this.data.start ? +moment(this.data.start).format('mm') : null,
    };
    this.end_date = this.data.end ? this.data.end : null;
    this.end_time = {
      h: this.data.end ? +moment(this.data.end).format('HH') : null,
      m: this.data.end ? +moment(this.data.end).format('mm') : null,
    };
  }

  closeDialog() {
    if (!this.noChanges()) {
      const confirmOnLeave = this.dialog.open(SaveChangeConfirmComponent, {
        width: '400px',
        disableClose: true,
      });

      confirmOnLeave.afterClosed().subscribe(
        status => {
          if (status) {
            this.saveChanges()
              .then(res => {
                this.dialogRef.close(this.data);
              });
          } else
            this.dialogRef.close();
        }
      );
    } else
      this.dialogRef.close(this.data);
  }

  hasDeliveryAgent() {
    return this.data.delivery_agent && Object.keys(this.data.delivery_agent).length;
  }

  getAddressPart(direction, part) {
    const cw = direction.toLowerCase() === 'from' ?
      (this.data.is_return ? 'customer' : 'warehouse') :
      (Object.keys(this.data.to.customer).length ? 'customer' : 'warehouse');
    return this.data[direction][cw].address[part];
  }

  deliveryAgentChange(data) {
    this.deliveryAgentId = data.value;
  }

  getDestinationName() {
    const tf = this.data.is_return ? 'from' : 'to';

    if (Object.keys(this.data[tf].customer).length)
      return this.data[tf].customer.address.recipient_name + ' ' + this.data[tf].customer.address.recipient_surname;
    else
      return this.data[tf].warehouse.name;
  }

  getDestinationPhone() {
    const tf = this.data.is_return ? 'from' : 'to';

    if (Object.keys(this.data[tf].customer).length)
      return this.data[tf].customer.address.recipient_mobile_no ? this.data[tf].customer.address.recipient_mobile_no : '';
    else
      return this.data[tf].warehouse.phone ? this.data[tf].warehouse.phone : '';
  }

  saveChanges() {
    if (moment(this.start_date, 'YYYY-MM-DD').isBefore(moment(moment().format('YYYY-MM-DD')))) {
      this.snackBar.open('تاریخ شروع انتخاب شده معتبر نمی باشد', null, {
        duration: 3200,
      });
      return Promise.reject('invalid start date');
    } else if (moment(this.start_date, 'YYYY-MM-DD').isSame(moment(moment().format('YYYY-MM-DD')))) {
      const currentHour = moment().format('HH');
      const currentMinute = moment().format('mm');

      if (this.start_time.h < +currentHour || (this.start_time.h === +currentHour && this.start_time.m <= +currentMinute)) {
        this.snackBar.open('زمان شروع انتخاب شده معتبر نمی باشد', null, {
          duration: 3200,
        });
        return Promise.reject('invalid start time');
      }
    }

    // Check end date and rise warning when end date is after maximum valid end date for delivery items
    if (this.isAfterMaxValidDate() || this.isAfterMaxValidDate(true)) {
      const dateConfirmation = this.dialog.open(ExpiredDateDialogComponent, {
        width: '400px',
      });

      return new Promise((resolve, reject) => {
        dateConfirmation.afterClosed().subscribe(
          status => {
            if (status) {
              this.upsertDeliveryDetails()
                .then(resolve)
                .catch(reject);
            }
          });
      });
    }

    return this.upsertDeliveryDetails();
  }

  private upsertDeliveryDetails() {
    return new Promise((resolve, reject) => {
      const updateObj = {_id: this.data._id};
      if (this.deliveryAgentId)
        updateObj['delivery_agent_id'] = this.deliveryAgentId;

      if (this.start_date) {
        if (this.start_time.m && this.start_time.h) {
          this.start_date = new Date(this.start_date);
          this.start_date.setHours(this.start_time.h, this.start_time.m);
        }

        updateObj['start'] = this.start_date;
      }

      if (this.end_date) {
        if (this.end_time.m && this.end_time.h) {
          this.end_date = new Date(this.end_date);
          this.end_date.setHours(this.end_time.h, this.end_time.m);
        }

        updateObj['end'] = this.end_date;
      }

      this.progressService.enable();
      this.httpService.post('delivery', updateObj).subscribe(
        data => {
          this.data.start = this.start_date ? this.start_date : this.data.start;
          this.data.end = this.end_date ? this.end_date : this.data.end;
          if (this.deliveryAgentId) {
            const dlAgent = this.deliveryAgentList.find(el => el._id === this.deliveryAgentId);
            this.data.delivery_agent.first_name = dlAgent.first_name;
            this.data.delivery_agent.surname = dlAgent.surname;
            this.data.delivery_agent.username = dlAgent.username;
            this.data.delivery_agent._id = this.deliveryAgentId;
          }
          this.snackBar.open('تغییرات با موفقیت ثبت شد', null, {
            duration: 2300,
          });
          this.progressService.disable();
          resolve();
        },
        err => {
          console.error('Cannot save changes on delivery: ', err);
          this.snackBar.open('ثبت تغییرات با خطا مواجه شد. دوباره تلاش کنید', null, {
            duration: 3200,
          });
          this.progressService.disable();
          reject();
        });
    });
  }

  noChanges() {
    let noChange = true;

    if ((this.deliveryAgentId && this.deliveryAgentId !== this.data.delivery_agent._id) ||
      (!this.deliveryAgentId && this.data.delivery_agent._id))
      noChange = false;

    const st = {
      h: +moment(this.data.start).format('HH'),
      m: +moment(this.data.start).format('mm'),
    };

    if ((this.data.start && !moment(this.start_date, 'YYYY-MM-DD').isSame(moment(this.data.start, 'YYYY-MM-DD'))) ||
      (!this.data.start && this.start_date))
      noChange = false;
    else if (this.start_date) {
      if ((this.data.start && (this.start_time.m !== st.m || this.start_time.h !== st.h)) ||
        (!this.data.start && (this.start_time.m || this.start_time.h)))
        noChange = false;
    }

    const et = {
      h: +moment(this.data.end).format('HH'),
      m: +moment(this.data.end).format('mm'),
    };

    if ((this.data.end && !moment(this.end_date, 'YYYY-MM-DD').isSame(moment(this.data.end, 'YYYY-MM-DD'))) ||
      (!this.data.end && this.end_date))
      noChange = false;
    else if (this.end_date) {
      if ((this.data.end && (this.end_time.m !== et.m || this.end_time.h !== et.h)) ||
        (!this.data.end && (this.end_time.m || this.end_time.h)))
        noChange = false;
    }

    return noChange;
  }

  changeTime(bound, part) {
    bound = bound + '_time';
    if (part === 'm') {
      if (this[bound].m < 0)
        this[bound].m = 0;
      else if (this[bound].m > 59)
        this[bound].m = 59;
    } else if (part === 'h') {
      if (this[bound].h < 0)
        this[bound].h = 0;
      else if (this[bound].h > 23)
        this[bound].h = 23;
    }
  }

  getFormattedDate(date) {
    if (!date)
      return '';
    return moment(date).format('YYYY-MM-DD');
  }

  getFormattedClock(date) {
    if (!date)
      return '';
    return moment(date).format('HH:mm:ss');
  }

  getMaxValidEndDate() {
    return this.data.min_end ? moment(this.data.min_end).format('YYYY-MM-DD') : '-';
  }

  isAfterMaxValidDate(isTime = false) {
    if (!this.data.min_end)
      return false;

    const isAfterValidDate = moment(this.end_date, 'YYYY-MM-DD').isAfter(moment(this.data.min_end, 'YYYY-MM-DD'));

    if (isAfterValidDate)
      return true;

    if (isTime &&
      moment(this.end_date, 'YYYY-MM-DD').isSame(moment(this.data.min_end, 'YYYY-MM-DD')) &&
      this.data.min_slot &&
      this.end_time.h > this.data.min_slot.upper_bound)
      return true;
    else
      return false;
  }
}
