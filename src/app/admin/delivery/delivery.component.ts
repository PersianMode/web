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
import {DeliveryTrackingComponent} from './components/delivery-tracking/delivery-tracking.component';
import {STATUS} from '../../shared/enum/status.enum';

export interface DeliveryItem {
  _id: String;
  position: Number;
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
  selectedDelivery = null;
  deliveryItems = null;
  displayedColumns = [
    'position',
    'end',
    'min_slot',
    'delivery_agent',
    'receiver_sender_name',
    'shelf_code',
    'is_delivered',
    'tracking',
    'view_details',
  ];
  deliveryAgentList = [];
  receiverSearchCtrl = new FormControl();
  agentSearchCtrl = new FormControl();
  isDelivered = null;
  endDateSearch = null;
  transferee = null;
  agentName = null;

  constructor(private httpService: HttpService, private progressService: ProgressService,
    private snackBar: MatSnackBar, private dialog: MatDialog,
    private authService: AuthService) {}

  ngOnInit() {
    if (!this.isHubClerk())
      this.displayedColumns = this.displayedColumns.filter(el => el.toLowerCase() !== 'shelf_code');

    this.receiverSearchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.transferee = data.trim() !== '' ? data.trim() : null;
        this.getDeliveryItems();
      }, err => {
        console.error('Couldn\'t refresh when receiver name is changed: ', err);
      }
    );

    this.agentSearchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.agentName = data.trim() !== '' ? data.trim() : null;
        this.getDeliveryItems();
      }, err => {
        console.error('Couldn\'t refresh when agent name is changed: ', err);
      }
    );

    this.dataSource = new MatTableDataSource<DeliveryItem>();
    this.selection = new SelectionModel<DeliveryItem>(true, []);

    this.sort.sortChange.subscribe(
      data => {
        this.sortColumn = data.active === 'receiver_sender_name' ? 'name' : data.active;
        this.direction = data.direction;
        this.getDeliveryItems();
      }
    );

    this.getDeliveryItems();
    this.getDeliveryAgents();
  }

  getDeliveryItems() {
    this.progressService.enable();
    this.httpService.post('delivery/items/' + (this.offset ? this.offset : 0) + '/' + (this.limit ? this.limit : 10), {
      sort_column: this.sortColumn,
      agentName: this.agentName,
      transferee: this.transferee,
      direction: this.direction,
      endDate: this.endDateSearch,
      isDelivered: this.isDelivered,
    }).subscribe(
      data => {
        this.deliveryItems = [];

        if (data && data.length) {
          data = data[0];

          this.deliveryItems = data.result;
          this.selection.clear();
          this.setDataSource(this.deliveryItems);
        } else
          this.setDataSource([]);

        this.totalRecords = data && data.total ? data.total : 0;
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

  setDataSource(data) {
    let counter = this.offset;
    const tempData = [];

    data.forEach(el => {
      tempData.push({
        _id: el._id,
        is_return: el.is_return,
        position: ++counter,
        min_slot: el.min_slot ? el.min_slot : null,
        delivery_agent: el.delivery_agent,
        shelf_code: el.shelf_code,
        order_line_count: el.order_line_count,
        start: el.start ? moment(el.start).format('YYYY-MM-DD') : null,
        end: el.end ? moment(el.end).format('YYYY-MM-DD') : null,
        delivery_start: moment(el.delivery_start).format('YYYY-MM-DD'),
        delivery_end: moment(el.delivery_end).format('YYYY-MM-DD'),
        receiver_sender_name: el.is_return
          ? (el.from.customer ? (el.from.customer.first_name + el.from.customer.surname) : null)
          : (Object.keys(el.to.customer).length ? (el.to.customer.first_name + el.to.customer.surname) : el.to.warehouse.name),
        is_delivered: this.deliveryIsDone(el),
      });
    });

    this.dataSource.data = tempData;
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
    const detailsDialog = this.dialog.open(DeliveryDetailsComponent, {
      width: '600px',
      disableClose: true,
      data: {
        deliveryItem: this.deliveryItems.find(el => el._id === id),
        agentList: this.deliveryAgentList,
        isHubClerk: this.isHubClerk(),
      },
    });

    detailsDialog.afterClosed().subscribe(() => this.setDataSource(this.deliveryItems));
  }

  showTracking(id) {
    this.dialog.open(DeliveryTrackingComponent, {
      width: '600px',
      data: {deliveryItem: this.deliveryItems.find(el => el._id === id)},
    });
  }

  isHubClerk() {
    return this.authService.userDetails.isAgent && +this.authService.userDetails.accessLevel === AccessLevel.HubClerk;
  }

  getCustomerInventoryName(element) {
    return Object.keys(element.to.customer).length ? element.to.customer.recipient_name : element.to.warehouse.name;
  }

  changeDeliverStatus() {
    if (this.isDelivered === null)
      this.isDelivered = true;
    else if (this.isDelivered === true)
      this.isDelivered = false;
    else if (this.isDelivered === false)
      this.isDelivered = null;

    this.getDeliveryItems();
  }

  deliveryIsDone(item) {
    return item.status_list && item.status_list.find(el => el.is_processed && el.status === STATUS.OnDelivery);
  }

  isAfterMaxValidEndDate(id) {
    const delItem = this.deliveryItems.find(el => el._id === id);
    return moment(delItem.end, 'YYYY-MM-DD').isAfter(moment(delItem.min_end, 'YYYY-MM-DD'));
  }
}
