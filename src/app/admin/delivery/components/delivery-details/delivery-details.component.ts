import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../../../../shared/services/http.service';
import * as moment from 'moment';
import {SaveChangeConfirmComponent} from '../../../../shared/components/save-change-confirm/save-change-confirm.component';
import {ProgressService} from '../../../../shared/services/progress.service';

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

  constructor(private dialogRef: MatDialogRef<DeliveryDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService, private dialog: MatDialog, private progressService: ProgressService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.deliveryAgentList = this.data.agentList;
    this.isHubClerk = this.data.isHubClerk;
    this.data = this.data.deliveryItem;
    this.deliveryAgentId = this.data.delivery_agent ? this.data.delivery_agent._id : null;

    this.start_date = this.data.start ? moment(this.data.start).format('YYYY-MM-DD') : null;
    this.start_time = {
      h: this.data.start ? +moment(this.data.start).format('hh') : null,
      m: this.data.start ? +moment(this.data.start).format('mm') : null,
    };
  }

  closeDialog() {
    if (!this.noChanges()) {
      const confirmOnLeave = this.dialog.open(SaveChangeConfirmComponent, {
        width: '400px',
      });

      confirmOnLeave.afterClosed().subscribe(
        status => {
          if (status) {
            this.saveChanges()
              .then(res => {
                this.dialogRef.close();
              });
          } else
            this.dialogRef.close();
        }
      );
    } else
      this.dialogRef.close();
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
    if (moment(this.start_date, 'YYYY-MM-DD').isBefore(moment(moment().format('YYYY-MM-DD')), 'day')) {
      this.snackBar.open('تاریخ انتخاب شده معتبر نمی باشد', null, {
        duration: 3200,
      });
      return Promise.reject('invalid start date');
    } else if (moment(this.start_date, 'YYYY-MM-DD').isSame(moment(moment().format('YYYY-MM-DD')), 'day')) {
      const currentHour = moment().format('HH');
      const currentMinute = moment().format('mm');

      if (this.start_time.h < currentHour || this.start_time.m <= currentMinute) {
        this.snackBar.open('زمان انتخاب شده معتبر نمی باشد', null, {
          duration: 3200,
        });
        return Promise.reject('invalid start time');
      }
    }

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

      this.progressService.enable();
      this.httpService.post('delivery', updateObj).subscribe(
        data => {
          this.data.start = this.start_date;
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

    const sd = moment(this.data.start).format('YYYY-MM-DD');
    const st = {
      h: +moment(this.data.start).format('hh'),
      m: +moment(this.data.start).format('mm'),
    };

    if ((this.data.start && this.start_date !== sd) || (!this.data.start && this.start_date))
      noChange = false;
    else if (this.start_date) {
      if ((this.data.start && (this.start_time.m !== st.m || this.start_time.h !== st.h)) ||
        (!this.data.start && this.start_time.m && this.start_time.h))
        noChange = false;
    }

    return noChange;
  }

  changeStartTime(part) {
    if (part === 'm') {
      if (this.start_time.m < 0)
        this.start_time.m = 0;
      else if (this.start_time.m > 59)
        this.start_time.m = 59;
    } else if (part === 'h') {
      if (this.start_time.h < 0)
        this.start_time.h = 0;
      else if (this.start_time.h > 23)
        this.start_time.h = 23;
    }
  }

  getEndDate() {
    return moment(this.data.end).format('YYYY-MM-DD');
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
}
