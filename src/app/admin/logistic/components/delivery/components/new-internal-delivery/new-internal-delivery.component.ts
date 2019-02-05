import {Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, OnDestroy} from '@angular/core';
import {MatSort, MatSnackBar, MatTableDataSource, MatDialog, MatPaginator} from '@angular/material';
import * as moment from 'moment';
import {HttpService} from 'app/shared/services/http.service';
import {ProgressService} from 'app/shared/services/progress.service';
import {SocketService} from 'app/shared/services/socket.service';
import {AuthService} from 'app/shared/services/auth.service';

@Component({
  selector: 'app-new-internal-delivery',
  templateUrl: './new-internal-delivery.component.html',
  styleUrls: ['./new-internal-delivery.component.css']
})
export class NewInternalDeliveryComponent implements OnInit, AfterViewInit, OnDestroy {


  @Output() OnUnassignedDeliveryCount = new EventEmitter();

  displayedColumns = [
    'position',
    'start',
    'delivery_agent',
    'receiver',
    'status'
  ];
  dataSource: MatTableDataSource<any>;

  pageSize = 10;
  total;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  socketSubscription: any;


  deliveryAgentList = [];


  constructor(private httpService: HttpService, private progressService: ProgressService,
    private snackBar: MatSnackBar, private dialog: MatDialog, private socketService: SocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.socketSubscription = this.socketService.getOrderLineMessage().subscribe(msg => {
      this.load();
    });

  }

  ngAfterViewInit(): void {
    this.load();
    this.getDeliveryAgents();
  }


  load() {
    this.progressService.enable();

    const options = {
      sort: this.sort.active,
      dir: this.sort.direction,
      type: 'InternalUnassignedDelivery',
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/DeliveryTicket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();

      res.data.forEach((order, index) => {
        order['index'] = index + 1;
      });
      this.dataSource = new MatTableDataSource<any>(res.data);
      this.total = res.total || 0;
      this.OnUnassignedDeliveryCount.emit(this.total);
    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا به هنگام دریافت ارسال های جدید');
    });
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

  deliveryAgentChange(deliveryId, agentId) {

    const body = {
      deliveryId,
      agentId
    };
    this.httpService.post('delivery/agent', body).subscribe(
      res => {
        this.load();
        this.openSnackBar('مسئول ارسال با موفقیت ثبت شد');
      },
      err => {
        console.log('-> ', err);
        this.openSnackBar(err.error);
      });


  }

  getDate(date) {
    if (!date)
      return '-';
    return moment(date).format('YYYY-MM-DD');
  }

  formatter(p) {
    return (+p).toLocaleString('fa');
  }

  onSortChange($event: any) {
    this.paginator.pageIndex = 0;
    this.load();
  }

  onPageChange($event: any) {
    this.load();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  getReceiver(element) {
    try {
      return this.authService.warehouses.find(x => x._id === element.to.warehouse_id).name;
    } catch (err) {
    }
  }
  ngOnDestroy(): void {
    if (this.socketSubscription)
      this.socketSubscription.unsubscribe();
  }
}
