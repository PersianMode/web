import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatPaginator, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import * as moment from 'jalali-moment';
import { HttpService } from '../../../../shared/services/http.service';
import { OrderLineStatuses , OrderStatuses} from '../../../../shared/lib/status';import {ProgressService} from 'app/shared/services/progress.service';
import {AccessTypes} from 'app/shared/lib/access_types';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})


export class TicketComponent implements OnInit {
  // 'desc'
  displayedColumns = [
    'position',
    'receiver_name',
    'receiver_type',
    'agent_name',
    'agent_type',
    'is_processed',
    'status',
    'timestamp'
  ];
  dataSource = new MatTableDataSource();

  isOrder = true;constructor(private httpService: HttpService , public dialogRef: MatDialogRef<TicketComponent>,private progressService: ProgressService
     @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
this.isOrder = !this.data.orderLineId;    const body: any = {
    orderId: this.data.orderId
    };
    if (!this.isOrder)
      body.orderLineId =this.data.orderLineId;

      this.progressService.enable(); this.httpService.post(`order/ticket`, body)
    .subscribe(res => {
    const tickets = res[0].tickets;

        tickets.sort((a, b) => (+new Date(b.timestamp)) - (+new Date(a.timestamp)));
          tickets.forEach((x, index) => {
            x['
              position'] = index + 1;
              });
              this.dataSource.data = tickets;
                        this.progressService.disable();
              }, err => {
        this.progressService.disable();
      });
  }


  getAgent(element) {
    return element.agent ? element.agent.first_name + ' ' + element.agent.surname : '-';
  }

  getAgentType(element) {
    if (element.agent) {
      return AccessTypes.find(x => x.level === element.agent.access_level).name;
    }
    return '-';
  }

  getReceiver(element) {
    if (element.agent_receiver) {
      return element.agent_receiver.first_name + ' ' + element.agent_receiver.surname;
    } else if (element.warehouse_receiver) {
      return element.warehouse_receiver.name;
    } else
      return '-';

  }
  getReceiverType(element) {
    if (element.agent_receiver) {
      return AccessTypes.find(x => x.level === element.agent_receiver.access_level).name;
    } else
      return '-';

  }
  getStatus(element) {
    try {
      if (this.isOrder)
        return OrderStatuses.find(x => x.status === element.status).name;
      else
        return OrderLineStatuses.find(x => x.status === element.status).name;
    } catch (err) {
      console.log('-> ', element);
    }
  }


  getTime(element) {
    return moment(element.timestamp).format('jYYYY/jMM/jDD HH:mm:ss');
  }

}


