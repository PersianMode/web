import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatPaginator, MatTableDataSource, MatDialog, MatSnackBar} from '@angular/material';
import * as moment from 'jalali-moment';
import { HttpService } from '../../../../shared/services/http.service';
import { OrderStatus } from '../../../../shared/lib/order_status';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})



export class TicketComponent implements OnInit {
  // 'desc'
  displayedColumns = ['position', 'agent_fullname', 'warehouse_name', 'is_processed', 'status', 'timestamp'];
  dataSource = new MatTableDataSource();

  constructor(private httpService: HttpService , public dialogRef: MatDialogRef<TicketComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const dataArr = [];
    this.httpService.get(`order/${this.data._orderId}/${this.data._orderLineId}`)
      .map(data => data.order_lines[0].tickets)
      .subscribe(tickets => {
        // loop each of ticket
        tickets.sort((a, b) => (+new Date(b.timestamp)) - (+new Date(a.timestamp)))
          .forEach((ticket, index) => {
            dataArr.push({
              position: index + 1,
              agent_fullname: ticket.agent_id.first_name + ' ' + ticket.agent_id.surname,
              warehouse_name: ticket.warehouse_id.name,
              // desc: ticket.desc,
              is_processed: ticket.is_processed,
              status: ticket.status,
              timestamp: moment(ticket.timestamp).format('jYYYY/jMM/jDD HH:mm:ss')
            });
        });
        this.dataSource.data = dataArr;
      });
  }

  getStatus(element) {
    const orderStatus = OrderStatus.find(x => x.status === element);
    return orderStatus ? orderStatus.name : 'نامشخص';

  }

}


