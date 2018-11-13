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
  isInternal = null;
  isReturn = null;
  startDateSearch = null;
  endDateSearch = null;
  transferee = null;
  agentName = null;
  isSalesManager = false;
  isHubClerk = false;

  constructor(private httpService: HttpService, private progressService: ProgressService,
    private snackBar: MatSnackBar, private dialog: MatDialog,
    private authService: AuthService) {}

  ngOnInit() {
    this.isHubClerk = this.authService.userDetails.isAgent && +this.authService.userDetails.accessLevel === AccessLevel.HubClerk;
    this.isSalesManager = this.authService.userDetails.isAgent && +this.authService.userDetails.accessLevel === AccessLevel.SalesManager;

    if (!this.isSalesManager) {
      this.displayedColumns = this.displayedColumns.filter(el => el !== 'view_details');
    }

    if (!this.isHubClerk) {
      this.displayedColumns = this.displayedColumns.filter(el => el !== 'shelf_code');
    }

    if (!this.isSalesManager && !this.isHubClerk) {
      this.displayedColumns = this.displayedColumns.filter(el => !['view_details', 'shelf_code', 'end', 'min_slot'].includes(el));
    }

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
  }

  getDeliveryItems() {
    this.progressService.enable();
    this.httpService.post('delivery/items/' + (this.offset ? this.offset : 0) + '/' + (this.limit ? this.limit : 10), {
      sort_column: this.sortColumn,
      agentName: this.agentName,
      transferee: this.transferee,
      direction: this.direction,
      delivery_end: this.endDateSearch,
      delivery_start: this.startDateSearch,
      isInternal: this.isInternal,
      isDelivered: this.isDelivered,
      isReturn: this.isReturn,
    }).subscribe(
      data => {
        this.deliveryItems = [];

        if (data) {
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
          ? (el.from.customer ? (el.from.customer.first_name + ' ' + el.from.customer.surname) : null)
          : (Object.keys(el.to.customer || {}).length ? (el.to.customer.first_name + ' ' + el.to.customer.surname) : el.to.warehouse.name),
        is_delivered: this.deliveryIsDone(el),
      });
    });

    this.dataSource.data = tempData;
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
      data: {
        deliveryItem: this.deliveryItems.find(el => el._id === id),
        isHubClerk: this.isHubClerk,
      },
    });
  }

  showTracking(id) {
    this.dialog.open(DeliveryTrackingComponent, {
      width: '600px',
      data: {deliveryItem: this.deliveryItems.find(el => el._id === id)},
    });
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

  changeInternalStatus() {
    if (this.isInternal === null) {
      this.isInternal = true;
    } else if (this.isInternal === true) {
      this.isInternal = false;
    } else if (this.isInternal === false) {
      this.isInternal = null;
    }

    this.getDeliveryItems();
  }

  changeReturnStatus() {
    if (this.isReturn === null) {
      this.isReturn = true;
    } else if (this.isReturn === true) {
      this.isReturn = false;
    } else if (this.isReturn === false) {
      this.isReturn = null;
    }

    this.getDeliveryItems();
  }

  deliveryIsDone(item) {
    return item.status_list && item.status_list.find(el => el.is_processed && el.status === STATUS.Delivered);
  }

  isAfterMaxValidEndDate(id) {
    const delItem = this.deliveryItems.find(el => el._id === id);
    return delItem.min_end ? moment(delItem.end, 'YYYY-MM-DD').isAfter(moment(delItem.min_end, 'YYYY-MM-DD')) : false;
  }
}
