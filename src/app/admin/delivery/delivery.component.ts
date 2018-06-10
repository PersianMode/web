import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSnackBar, MatTableDataSource, MatDialog} from '@angular/material';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {FormControl} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {DeliveryDetailsComponent} from './components/delivery-details/delivery-details.component';
import * as moment from 'moment';

export interface DeliveryItem {
  _id: String;
  position: Number;
  delivery_date: Date;
  delivery_time: String;
  delivery_agent: String;
  shelf_code: String;
  start_date: Date;
  end_date: Date;
  return: any;
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

  constructor(private httpService: HttpService, private progressService: ProgressService,
    private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
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
            return: el.return,
            position: ++counter,
            delivery_date: el.slot ? moment(el.slot.date).format('YYYY-MM-DD') : null,
            delivery_time: el.slot ? el.slot.time : null,
            delivery_agent: el.sender_name,
            shelf_code: el.shelf_code,
            order_line_count: el.order_line_count,
            stat_date: moment(el.start_date).format('YYYY-MM-DD'),
            end_date: moment(el.end_date).format('YYYY-MM-DD'),
            receiver_sender_name: Object.keys(el.return).length
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
      data: {deliveryItem: this.deliveryItems.find(el => el._id === id)},
    });
  }
}
