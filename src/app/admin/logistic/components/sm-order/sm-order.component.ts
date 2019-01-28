import {Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy} from '@angular/core';
import {TicketComponent} from '../ticket/ticket.component';
import {OrderAddressComponent} from '../order-address/order-address.component';
import {OrderLineStatuses, OrderStatuses} from '../../../../shared/lib/status';
import {ProductViewerComponent} from '../product-viewer/product-viewer.component';
import {imagePathFixer} from '../../../../shared/lib/imagePathFixer';
import * as moment from 'jalali-moment';
import {HttpService} from '../../../../shared/services/http.service';
import {MatDialog, MatSnackBar, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ProgressService} from '../../../../shared/services/progress.service';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {FormControl} from '@angular/forms';
import {ORDER_STATUS, ORDER_LINE_STATUS} from 'app/shared/enum/status.enum';
import {RemovingConfirmComponent} from 'app/shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-sm-order',
  templateUrl: './sm-order.component.html',
  styleUrls: ['./sm-order.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SmOrderComponent implements OnInit, OnDestroy {

  displayedColumns = [
    'position',
    'customer',
    'address',
    'order_time',
    'transaction_id',
    'tickets',
    'status',
    'proccess'
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  pageSize = 10;
  total;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  expandedElement: any;

  statusSearchCtrl = new FormControl();
  receiverSearchCtrl = new FormControl();
  transIdCtrl = new FormControl();

  receiver = null;
  transId = null;
  status = null;
  orderTime = null;
  listStatus: {name: string, status: number}[] = [
    {name: 'همه موارد', status: null}
  ];

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(private httpService: HttpService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private progressService: ProgressService) {
  }

  ngOnInit() {
    // set status
    this.listStatus = this.listStatus.concat(OrderStatuses.map(el => ({name: el.name, status: el.status})));
    this.receiverSearchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.receiver = data.trim() !== '' ? data.trim() : null;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when receiver name is changed: ', err);
      }
    );

    this.transIdCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.transId = data.trim() !== '' ? data.trim() : null;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when agent name is changed: ', err);
      }
    );

    this.statusSearchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.status = data;
        this.load();
      }, err => {
        console.error('Couldn\'t refresh when agent name is changed: ', err);
      }
    );

    this.load();

  }

  load() {

    this.progressService.enable();

    const tempId = this.expandedElement;
    this.expandedElement = null;
    const options = {
      transId: this.transId,
      receiver: this.receiver,
      orderTime: this.orderTime,
      status: this.status,
      type: 'OrdersHistory',
    };
    const offset = this.paginator.pageIndex * +this.pageSize;
    const limit = this.pageSize;

    this.httpService.post('search/Ticket', {options, offset, limit}).subscribe(res => {
      this.progressService.disable();
      const rows = [];
      res.data.forEach((order, index) => {
        order['index'] = index + 1;
        rows.push(order, {detailRow: true, order});
      });
      this.dataSource.data = rows;

      this.total = res.total ? res.total : 0;

      setTimeout(() => {
        this.expandedElement = tempId;
      }, 100);

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در دریافت لیست سفارش‌ها');
    });
  }

  getDate(time) {
    try {
      if (time)
        return moment(time).format('jYYYY/jMM/jDD HH:mm:ss');
    } catch (err) {
    }
  }

  getProductDetail(orderLine) {

    const product_color = orderLine.product_colors.find(x => x._id === orderLine.instance.product_color_id);
    const thumbnailURL = (product_color && product_color.image && product_color.image.thumbnail) ?
      imagePathFixer(product_color.image.thumbnail, orderLine.instance.product_id, product_color._id)
      : null;
    return {
      name: orderLine.instance.product_name,
      thumbnailURL,
      color: product_color ? product_color.name : null,
      color_code: product_color ? product_color.code : null,
      size: orderLine.instance.size,
      product_id: orderLine.instance.product_id
    };
  }

  showDetial(orderLine) {
    this.dialog.open(ProductViewerComponent, {
      width: '400px',
      data: this.getProductDetail(orderLine)
    });
  }


  getOrderLineStatus(orderLine) {
    if (orderLine && orderLine.tickets) {
      const lastTicket = orderLine.tickets && orderLine.tickets.length ? orderLine.tickets[orderLine.tickets.length - 1] : null;
      return OrderLineStatuses.find(x => x.status === lastTicket.status).name;
    }
  }

  showAddress(order) {
    this.dialog.open(OrderAddressComponent, {
      width: '400px',
      data: {address: order.address, is_collect: !!order.is_collect}
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  onSortChange($event: any) {
    this.paginator.pageIndex = 0;
    this.load();
  }

  onPageChange($event: any) {
    this.load();
  }


  getCustomer(order) {
    try {
      return order.address.recipient_name + ' ' + order.address.recipient_surname;
    } catch (err) {
    }

  }

  getStatus(item, isOrderLine) {
    try {
      if (isOrderLine) {
        const ticket = OrderLineStatuses.find(x => x.status === item.tickets[item.tickets.length - 1].status).name;
        if (item.cancel)
          return `${'لفو شده'} - ${ticket}`;
      } else
        return OrderStatuses.find(x => x.status === item.tickets[item.tickets.length - 1].status).name;
    } catch (e) {
      console.error('error in getStatus. (.length, probably?)');
    }
  }

  showTicket(order, orderLine) {
    this.dialog.open(TicketComponent, {
      width: '1000px',
      height: '600px',
      data: {orderId: order._id, orderLineId: orderLine ? orderLine._id : null}
    });
  }

  isCancellable(order, orderLine) {
    try {
      const cond1 = !order.tickets.map(x => x.status).includes(ORDER_STATUS.WaitForInvoice);
      let cond2;
      if (!orderLine) {
        cond2 = order.order_lines.find(x => !x.cancel);
      } else {
        cond2 = !orderLine.cancel;
      }
      return cond1 && !!cond2;
    } catch (e) {
      console.error('error in isCancellable. (.map, probably?)');
    }

  }

  cancel(order, orderLine) {
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px',
      data: {message: 'آیا از لغو این مورد اطمینان دارید؟'}
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {

          const body: any = {
            orderId: order._id
          };

          if (orderLine)
            body.orderLineId = orderLine._id;

          this.progressService.enable();
          this.httpService.post('order/cancel', body).subscribe(
            data => {
              this.progressService.disable();
            },
            er => {
              this.snackBar.open('خطا به هنگام لغو سفارش', null, {
                duration: 3200,
              });
              this.progressService.disable();
            });
        }
      },
      err => {
        console.error('Error when subscribing on rmDialog.afterClosed() function: ', err);
      });
  }


  ngOnDestroy(): void {
  }

}
