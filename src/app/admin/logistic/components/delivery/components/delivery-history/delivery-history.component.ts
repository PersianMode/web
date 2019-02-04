import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSnackBar, MatTableDataSource, MatDialog, MatPaginator} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import * as moment from 'jalali-moment';
import {HttpService} from 'app/shared/services/http.service';
import {ProgressService} from 'app/shared/services/progress.service';
import {AuthService} from 'app/shared/services/auth.service';
import {AccessLevel} from 'app/shared/enum/accessLevel.enum';
import {DeliveryDetailsComponent} from '../delivery-details/delivery-details.component';
import {DeliveryTrackingComponent} from '../delivery-tracking/delivery-tracking.component';
import {DeliveryStatuses} from '../../../../../../shared/lib/status';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {OrderLineViewerComponent} from '../../../order-line-viewer/order-line-viewer.component';

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
  sender_name: String;
  receiver_name: String;
}

@Component({
  selector: 'app-delivery-history',
  templateUrl: './delivery-history.component.html',
  styleUrls: ['./delivery-history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DeliveryHistoryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table;
  expandedElement: any;
  limit: any = 10;
  offset: any = 0;
  dataSource = null;
  pageSize = 10;
  totalRecords = 0;
  selection = null;
  sort_column = null;
  direction = 'asc';
  selectedDelivery = null;
  deliveryItems = null;
  displayedColumns = [
    'position',
    'delivery_agent',
    'sender_name',
    'receiver_name',
    'shelf_code',
    'is_delivered',
    'view_details',
  ];
  deliveryAgentList = [];
  receiverSearchCtrl = new FormControl();
  recipient_name = new FormControl();
  agentSearchCtrl = new FormControl();
  SenderSearchCtrl = new FormControl();
  isDelivered = null;
  isInternal = null;
  startDateSearch = null;
  transferee = null;
  recipient = null;
  agentName = null;
  sender = null;
  isSalesManager = false;
  isHubClerk = false;
  search;
  isOrigin = true;
  isDestination = true;
  fromWarehouse = null;
  toWarehouse = null;
  warehouseSelected = new FormGroup({
      fromWarehouseId: new FormControl(),
      toWarehouseId: new FormControl()
    }
  );

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(private httpService: HttpService, private progressService: ProgressService, private snackBar: MatSnackBar, private dialog: MatDialog,
              private authService: AuthService) {
  }

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
      this.displayedColumns = this.displayedColumns.filter(el => !['view_details', 'shelf_code'].includes(el));
    }

    this.receiverSearchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.transferee = data.trim() !== '' ? data.trim() : null;
        this.getDeliveryItems();
      }, err => {
        console.error('Couldn\'t refresh when receiver name is changed: ', err);
      }
    );

    this.recipient_name.valueChanges.debounceTime(500).subscribe(
      data => {
        this.recipient = data.trim() !== '' ? data.trim() : null;
        this.getDeliveryItems();
      }, err => {
        console.error('Couldn\'t refresh when recipient name is changed: ', err);
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

    this.SenderSearchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.sender = data.trim() !== '' ? data.trim() : null;
        this.getDeliveryItems();
      }, err => {
        console.error('Could\'t refresh when sender name is changed: ', err);
      }
    );

    this.dataSource = new MatTableDataSource<DeliveryItem>();
    this.selection = new SelectionModel<DeliveryItem>(true, []);

    this.sort.sortChange.subscribe(
      data => {
        this.sort_column = data.active === 'sort_column' ? 'name' : data.active;
        this.direction = data.direction;
        this.getDeliveryItems();
      }
    );

    this.getDeliveryItems();
    this.getDeliveryAgents();
  }

  getDeliveryAgents() {
    this.httpService.get('delivery/agent').subscribe(
      data => {
        console.log('delivery agent: ', data);
        this.deliveryAgentList = data;
      },
      err => {
        console.error('Cannot get delivery agent list: ', err);
      });
  }

  getDeliveryItems() {
    this.progressService.enable();
    const options = {
      sort_column: this.sort_column,
      agentName: this.agentName,
      transferee: this.transferee,
      sender: this.sender,
      direction: this.direction,
      startDateSearch: this.startDateSearch,
      isInternal: this.isInternal,
      isDelivered: this.isDelivered,
      fromWarehouse: this.fromWarehouse,
      toWarehouse: this.toWarehouse,
      recipient: this.recipient,

      sort: this.sort.active,
      dir: this.sort.direction,

      type: 'DeliveryHistory',
    };
    const offset = this.offset ? this.offset : 0;
    const limit = this.limit ? this.limit : 10;
    this.progressService.enable();
    this.httpService.post('search/DeliveryTicket', {options, offset, limit}).subscribe(res => {
        this.progressService.disable();

        const rows = [];
        this.search = res.data;
        if (this.search) {
          for (let delivery of this.search) {
            const order_data = [];
            let order_details = delivery.order_details;
            let order_lines = delivery.order_lines;
            order_lines.forEach(x => {
              let foundOrder = order_details.find(y => y.order_line_ids === x.order_lines_id);
              let preOrderData = order_data.find(y => y.order_id === foundOrder.order_id);
              if (preOrderData) {
                preOrderData.order_lines.push(x);
              } else {
                order_data.push(Object.assign(foundOrder, {order_lines: [x]}));
              }
            });

            delivery.orders = order_data;
          }
        }
        if (this.search) {
          this.deliveryItems = this.search;
        } else
          this.deliveryItems = '';
        this.totalRecords = res.total ? res.total : 0;
        if (this.deliveryItems) {
          this.deliveryItems.forEach((order, index) => {
            order['index'] = index + 1;
            rows.push(order, {detailRow: true, order});
          });

          this.dataSource = rows;
        }
        else this.dataSource = '';

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
    if (this.isInternal === null)
      this.isInternal = true;
    else if (this.isInternal === true)
      this.isInternal = false;
    else if (this.isInternal === false)
      this.isInternal = null;

    this.getDeliveryItems();
  }

  changeStartDeliverStatus() {
    if (this.isDelivered === null)
      this.isDelivered = true;
    else if (this.isDelivered === true)
      this.isDelivered = false;
    else if (this.isDelivered === false)
      this.isDelivered = null;
    this.getDeliveryItems();
  }

  changeOriginStatus() {
    if (this.isOrigin === true) {
      this.isOrigin = false;
      this.fromWarehouseChange(null);
    } else if (this.isOrigin === false) {
      this.isOrigin = true;
      this.fromWarehouseChange(null);
    }
    this.getDeliveryItems();
  }

  changeDestinationStatus() {

    if (this.isDestination === true) {
      this.isDestination = false;
      this.toWarehouseChange(null);
    } else if (this.isDestination === false) {
      this.isDestination = true;
      this.toWarehouseChange(null);
    }
    this.getDeliveryItems();
  }

  deliveryAgentChange(deliveryId, data) {
    const foundDeliveryItem = this.deliveryItems.find((el: any) => el._id.toString() === deliveryId.toString());

    if (!data.value ||
      foundDeliveryItem.delivery_end || foundDeliveryItem.delivery_start ||
      (foundDeliveryItem.delivery_agent && foundDeliveryItem.delivery_agent._id &&
        data.value.toString() === foundDeliveryItem.delivery_agent._id.toString())) {
      return;
    }

    this.progressService.enable();
    this.httpService.post('delivery', {
      delivery_agent_id: data.value,
      _id: deliveryId,
    }).subscribe(
      res => {
        const foundDeliveryAgent = this.deliveryAgentList.find(el => el._id.toString() === data.value.toString());
        if (!foundDeliveryItem.delivery_agent || !foundDeliveryItem.delivery_agent._id) {
          foundDeliveryItem.delivery_agent = {};
        }
        foundDeliveryItem.delivery_agent['_id'] = data.value;
        foundDeliveryItem.delivery_agent['first_name'] = foundDeliveryAgent.first_name;
        foundDeliveryItem.delivery_agent['surname'] = foundDeliveryAgent.surname;
        foundDeliveryItem.delivery_agent['username'] = foundDeliveryAgent.username;

        // this.setDataSource(this.deliveryItems);

        this.progressService.disable();
        this.snackBar.open('مسئول ارسال با موفقیت ثبت شد', null, {
          duration: 2000,
        });
      },
      err => {
        console.error('Error when store/update internal delivery agent: ', err);
        this.progressService.disable();
        this.snackBar.open('ثبت مسئول ارسال با خطا مواجه شد', 'بستن', {
          duration: 2000,
        });
      });
  }

  onSortChange($event: any) {
    this.paginator.pageIndex = 0;
    this.getDeliveryItems();
  }

  getDeliveryStatus(delivery) {
    if (delivery && delivery.last_ticket) {
      return DeliveryStatuses.find(x => x.status === delivery.last_ticket.status).name;
    }
  }

  getDate(orderTime) {
    return moment(orderTime).format('jYYYY/jMM/jDD HH:mm:ss');
  }

  showOrderLine(orderLines) {
    this.dialog.open(OrderLineViewerComponent, {
      width: '800px',
      height: '400px',
      autoFocus: false,
      data: orderLines
    });
  }

  getWarehouses() {
    return this.authService.warehouses
      .sort((a, b) => a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0);
  }

  fromWarehouseChange(fromWarehouse) {
    if (!fromWarehouse) {
      this.fromWarehouse = null;
      this.warehouseSelected.patchValue({fromWarehouseId: null});
      this.getDeliveryItems();
      return
    }
    this.fromWarehouse = fromWarehouse;
    this.getDeliveryItems();
  }

  toWarehouseChange(toWarehouseId) {
    if (!toWarehouseId) {
      this.toWarehouse = null;
      this.warehouseSelected.patchValue({toWarehouseId: null});
      this.getDeliveryItems();
      return
    }
    this.toWarehouse = toWarehouseId;
    this.getDeliveryItems();
  }

  onSubmit() {
  }
}
