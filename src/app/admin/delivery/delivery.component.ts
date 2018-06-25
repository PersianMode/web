import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSnackBar, MatTableDataSource, MatDialog} from '@angular/material';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {FormControl} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {DeliveryDetailsComponent} from './components/delivery-details/delivery-details.component';
import {AccessLevel} from '../../shared/enum/accessLevel.enum';
import * as moment from 'moment';
import {AuthService} from '../../shared/services/auth.service';

export interface DeliveryItem {
  _id: String;
  position: Number;
  delivery_date: Date;
  delivery_time: String;
  delivery_agent: String;
  shelf_code: String;
  start: Date;
  end: Date;
  delivery_start: Date;
  delivery_end: Date;
  is_return: Boolean;
  is_delivered: Boolean;
  receiver_sender_name: String;
}

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table;
  limit: any = 10;
  offset: any = 0;
  dataSource = null;
  totalRecords = 0;
  selection = null;
  sortColumn = null;
  direction = 'asc';
  agentNameCtrl: FormControl;
  agentName = '';
  receiverNameCtrl: FormControl;
  receiverName = '';
  selectedDelivery = null;
  deliveryItems = null;
  displayedColumns = [
    'position',
    'delivery_date',
    'delivery_time',
    'delivery_agent',
    'receiver_sender_name',
    'shelf_code',
    'is_delivered',
    'view_details',
  ];
  deliveryAgentList = [];

  constructor(private httpService: HttpService, private progressService: ProgressService,
    private snackBar: MatSnackBar, private dialog: MatDialog,
    private authService: AuthService) {}

  ngOnInit() {
    if (!this.isHubClerk())
      this.displayedColumns = this.displayedColumns.filter(el => el.toLowerCase() !== 'shelf_code');

    this.agentNameCtrl = new FormControl();
    this.agentNameCtrl.valueChanges.debounceTime(500).subscribe(
      (data) => {
        this.agentName = data;
        this.getDeliveryItems();
      }
    );

    this.receiverNameCtrl = new FormControl();
    this.receiverNameCtrl.valueChanges.debounceTime(500).subscribe(
      (data) => {
        this.receiverName = data;
        this.getDeliveryItems();
      }
    );

    this.dataSource = new MatTableDataSource<DeliveryItem>();
    this.selection = new SelectionModel<DeliveryItem>(true, []);

    this.sort.sortChange.subscribe(
      data => {
        this.sortColumn = data.active;
        this.direction = data.direction;
        this.getDeliveryItems();
      }
    );

    this.getDeliveryItems();
    this.getDeliveryAgents();
  }

  getDeliveryItems() {
    this.progressService.enable();
    this.httpService.post('delivery/items/' + this.offset + '/' + this.limit, {
      sort_column: this.sortColumn,
      agentName: this.agentName,
      receiverName: this.receiverName,
    }).subscribe(
      data => {
        console.log('Data: ', data);

        this.deliveryItems = data;
        const tempData = [];
        this.selection.clear();
        let counter = this.offset;
        data.forEach(el => {
          tempData.push({
            _id: el._id,
            is_return: el.is_return,
            position: ++counter,
            delivery_date: moment(el.end).format('YYYY-MM-DD'),
            delivery_time: el.slot ? el.slot : null,
            delivery_agent: el.sender_name,
            shelf_code: el.shelf_code,
            order_line_count: el.order_line_count,
            start: moment(el.start_date).format('YYYY-MM-DD'),
            end: moment(el.end_date).format('YYYY-MM-DD'),
            delivery_start: moment(el.delivery_start).format('YYYY-MM-DD'),
            delivery_end: moment(el.delivery_end).format('YYYY-MM-DD'),
            receiver_sender_name: el.is_return
              ? (el.from.customer ? (el.from.customer.first_name + el.from.customer.surname) : null)
              : (el.to.customer ? (el.to.customer.first_name + el.to.customer.surname) : null),
            is_delivered: el.end_date ? true : false,
          });
        });
        this.dataSource.data = tempData;

        this.totalRecords = data.length > 0 ? data[0].total : 0;
        this.progressService.disable();
      },
      err => {
        console.error('Cannot get data: ', err);
        this.snackBar.open('در حال حاضر قادر به دریافت اطلاعات نیستیم. دوباره تلاش کنید', null, {
          duration: 3200,
        });
        this.progressService.disable();
      }
    );
  }

  getDeliveryAgents() {
    this.httpService.get('delivery/agent').subscribe(
      data => {
        this.deliveryAgentList = data;
      },
      err => {
        console.error('Cannot get delivery agent list: ', err);
      });
  }

  changePageSetting(data) {
    this.limit = data.pageSize ? data.pageSize : 10;
    this.offset = data.pageIndex * this.limit;

    this.getDeliveryItems();
  }

  formatter(p) {
    return (+p).toLocaleString('fa');
  }

  showDetails(id) {
    this.dialog.open(DeliveryDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: {
        deliveryItem: this.deliveryItems.find(el => el._id === id),
        agentList: this.deliveryAgentList,
        isHubClerk: this.isHubClerk(),
      },
    });
  }

  isHubClerk() {
    return this.authService.userDetails.isAgent && +this.authService.userDetails.accessLevel === AccessLevel.HubClerk;
  }
}
