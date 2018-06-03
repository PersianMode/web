import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSnackBar, MatTableDataSource} from '@angular/material';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {FormControl} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';

export interface DeliveryItem {
  position: Number;
  delivery_date: Date;
  delivery_time: String;
  delivery_agent: String;
  order_code: String;
  order_line_count: Number;
  is_delivered: Boolean;
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
  displayedColumns = ['position', 'delivery_date', 'delivery_time', 'delivery_agent', 'order_code', 'order_line_count', 'is_delivered'];

  constructor(private httpService: HttpService, private progressService: ProgressService,
    private snackBar: MatSnackBar) {}

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
        const tempData = [];
        this.selection.clear();
        let counter = this.offset;
        data.forEach(el => {
          tempData.push({
            position: ++counter,
            delivery_date: el.end_date,
            delivery_time: el.delivery_time,
            delivery_agent: el.sender_name,
            order_code: el.order_code,
            order_line_count: el.order_line_count,
            is_delivered: el.end_date ? true : false,
          });
        });
        this.dataSource.data = tempData;
        // this.dataSource.data = [{
        //   position: 1,
        //   delivery_date: new Date(),
        //   delivery_time: '10-18',
        //   delivery_agent: 'Ali Alavi',
        //   order_code: 'AB',
        //   order_line_count: 2,
        //   is_delivered: true,
        // }, {
        //   position: 2,
        //   delivery_date: new Date(2017, 10, 10),
        //   delivery_time: '18-22',
        //   delivery_agent: 'Taghi Taghavi',
        //   order_code: 'CE',
        //   order_line_count: 5,
        //   is_delivered: true,
        // }, {
        //   position: 3,
        //   delivery_date: null,
        //   delivery_time: null,
        //   delivery_agent: null,
        //   order_code: 'AB',
        //   order_line_count: 2,
        //   is_delivered: false,
        // }];

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
}
